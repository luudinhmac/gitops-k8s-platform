import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import { User, UserRole, Post as PostInterface } from '@portfolio/contracts';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { AdminAlertService } from '../../admin-alert/admin-alert.service';
import { PostsRepository } from './posts.repository';
import { IStorageService, STORAGE_SERVICE } from '../../infrastructure/storage/storage.interface';
import { ImageProcessor } from '../../common/image-processor';

@Injectable()
export class PostsService {
  constructor(
    private repository: PostsRepository,
    @Inject(STORAGE_SERVICE) private storageService: IStorageService,
    private notificationsService: NotificationsService,
    private adminAlertService: AdminAlertService,
  ) {}

  private calculateReadTime(content: string | null | undefined): number {
    if (!content) return 1;
    const imageCount = (content.match(/<img/g) || []).length;
    const videoCount = (content.match(/<(iframe|video)/g) || []).length;
    const cleanText = content.replace(/<[^>]*>/g, '');
    const words = cleanText.trim().split(/\s+/).length;
    const wordsSeconds = (words / 200) * 60;
    const imagesSeconds = imageCount * 10;
    const videosSeconds = videoCount * 45;
    const totalSeconds = wordsSeconds + imagesSeconds + videosSeconds;
    const readTime = Math.ceil(totalSeconds / 60);
    return readTime > 0 ? readTime : 1;
  }

  private sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'p', 'br',
      'strong', 'em', 'u', 's', 'blockquote', 'pre', 'ol', 'ul', 'li', 'a',
    ]),
    allowedAttributes: {
      '*': ['style', 'class', 'id', 'align'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'style'],
    },
    allowedStyles: {
      '*': {
        color: [
          /^#(?:[0-9a-fA-F]{3}){1,2}$/,
          /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
          /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([\d.]+)\s*\)$/,
        ],
        'background-color': [/.*/],
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'font-family': [/.*/],
        'font-size': [/.*/],
        'font-weight': [/.*/],
        'text-decoration': [/.*/],
        margin: [/.*/],
        padding: [/.*/],
        'padding-left': [/.*/],
        'list-style-type': [/.*/],
      },
    },
  };

  async findAll(
    user?: User,
    isAdmin: boolean = false,
    query?: string,
    status?: string,
    sort?: string,
    userId?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: PostInterface[]; meta: { page: number; limit: number; total: number } }> {
    const where: Record<string, any> = {};
    if (userId) {
      where.author_id = userId;
    }
    
    if (!isAdmin) {
      where.is_published = true;
      where.is_blocked = false;
    } else if (user) {
      if (
        user.role !== UserRole.ADMIN &&
        user.role !== UserRole.SUPERADMIN
      ) {
        where.author_id = user.id;
      }
    }

    if (isAdmin && status && status !== 'all') {
      if (status === 'published') {
        where.is_published = true;
        where.is_blocked = false;
      } else if (status === 'draft') {
        where.is_published = false;
        where.is_blocked = false;
      } else if (status === 'blocked') {
        where.is_blocked = true;
      }
    }

    if (query) {
      const queryFilter = { contains: query, mode: 'insensitive' as any };
      const searchCriteria = [
        { title: queryFilter },
        { content: queryFilter },
        { Tag: { some: { name: queryFilter } } },
        { Category: { name: queryFilter } },
        { Series: { name: queryFilter } },
      ];
      
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchCriteria }];
        delete where.OR;
      } else {
        where.OR = searchCriteria;
      }
    }

    const select: any = {
      id: true, title: true, content: true, slug: true, cover_image: true,
      is_pinned: true, is_published: true, is_blocked: true, views: true,
      likes: true, created_at: true, updated_at: true, author_id: true,
      series_id: true, series_order: true,
      Category: { select: { id: true, name: true, slug: true } },
      User: { select: { id: true, fullname: true, username: true, avatar: true } },
      Tag: { select: { id: true, name: true } },
      Series: { select: { id: true, name: true, slug: true } },
      _count: { select: { Comment: true, PostLike: true } },
    };

    const orderBy: any[] = [{ is_pinned: 'desc' }];
    if (sort === 'views') orderBy.push({ views: 'desc' });
    else if (sort === 'likes') orderBy.push({ likes: 'desc' });
    else if (sort === 'comments') orderBy.push({ Comment: { _count: 'desc' } });
    else orderBy.push({ created_at: 'desc' });

    const [posts, total] = await Promise.all([
      this.repository.findMany({
        where,
        orderBy,
        select,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.repository.count({ where }),
    ]);

    const formattedPosts = posts.map((post: any) => {
      const readTime = this.calculateReadTime(post.content);
      const { content, ...rest } = post;
      return { 
        ...rest, 
        readTime,
        comment_count: post._count?.Comment || 0,
        likes: post._count?.PostLike || post.likes || 0
      };
    }) as unknown as PostInterface[];

    return {
      data: formattedPosts,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async findOne(
    idOrSlug: string | number,
    incrementView: boolean = false,
  ): Promise<PostInterface> {
    const isId = !isNaN(Number(idOrSlug));
    const where: Record<string, any> = isId
      ? { id: Number(idOrSlug) }
      : { slug: String(idOrSlug) };

    if (incrementView) {
      try {
        await this.repository.update({
          where,
          data: { views: { increment: 1 } },
        });
      } catch (err) {
        console.error('Error incrementing view:', err);
      }
    }

    const select: any = {
      id: true, title: true, content: true, slug: true, cover_image: true,
      is_pinned: true, is_published: true, is_blocked: true, views: true,
      likes: true, created_at: true, updated_at: true, series_id: true,
      series_order: true, category_id: true, author_id: true,
      Category: { select: { id: true, name: true, slug: true } },
      User: { select: { fullname: true, avatar: true, username: true } },
      Tag: { select: { id: true, name: true } },
      Series: { select: { id: true, name: true, slug: true } },
      Comment: {
        orderBy: { created_at: 'desc' },
        select: {
          id: true, content: true, author_name: true, author_email: true,
          created_at: true, user_id: true, parent_id: true,
          User: { select: { avatar: true, fullname: true, username: true } },
        },
      },
      _count: { select: { Comment: true, PostLike: true } },
    };

    let post = await this.repository.findUnique({ where, select }) as any;

    if (!post && isId) {
      post = await this.repository.findUnique({
        where: { slug: String(idOrSlug) },
        select,
      });
    }

    if (!post) throw new NotFoundException('Post not found');

    let prevPost: any | null = null;
    let nextPost: any | null = null;
    if (post.series_id) {
      const currentOrder = post.series_order ?? 0;
      [prevPost, nextPost] = await Promise.all([
        this.repository.findFirst({
          where: {
            series_id: post.series_id,
            is_published: true,
            OR: [
              { series_order: { lt: currentOrder } },
              { series_order: currentOrder, created_at: { lt: post.created_at } },
            ],
          },
          orderBy: [{ series_order: 'desc' }, { created_at: 'desc' }],
          select: { id: true, title: true, slug: true, Category: { select: { slug: true } } },
        }),
        this.repository.findFirst({
          where: {
            series_id: post.series_id,
            is_published: true,
            OR: [
              { series_order: { gt: currentOrder } },
              { series_order: currentOrder, created_at: { gt: post.created_at } },
            ],
          },
          orderBy: [{ series_order: 'asc' }, { created_at: 'asc' }],
          select: { id: true, title: true, slug: true, Category: { select: { slug: true } } },
        }),
      ]);
    }

    return {
      ...post,
      readTime: this.calculateReadTime(post.content),
      prevPost,
      nextPost,
    } as unknown as PostInterface;
  }

  async create(user: User, data: CreatePostDto): Promise<PostInterface> {
    if (!(user as any).can_post) {
      throw new ForbiddenException('Tài khoản của bạn đã bị cấm đăng bài.');
    }
    const {
      title, content, slug, category_id, series_id, series_order,
      cover_image, is_pinned, is_published, tags,
    } = data;
    const cleanContent = sanitizeHtml(content || '', this.sanitizeOptions);

    const baseSlug = slug || slugify(title, { lower: true, strict: true, locale: 'vi' });
    let finalSlug = baseSlug;
    let count = 0;
    while (true) {
      const existing = await this.repository.findUnique({ where: { slug: finalSlug } });
      if (!existing) break;
      count++;
      finalSlug = `${baseSlug}-${count}`;
    }

    const createData: Record<string, any> = {
      title,
      slug: finalSlug,
      content: cleanContent,
      cover_image: cover_image || null,
      is_pinned: (user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN) && is_pinned ? true : false,
      is_published: is_published !== undefined ? is_published : true,
      User: { connect: { id: user.id } },
      series_order: series_order ? Number(series_order) : 0,
    };

    if (data.series_name && data.series_name.trim()) {
      const seriesName = data.series_name.trim();
      const seriesSlug = slugify(seriesName, { lower: true, strict: true, locale: 'vi' });
      createData.Series = {
        connectOrCreate: {
          where: { name: seriesName },
          create: { name: seriesName, slug: seriesSlug }
        }
      };
    } else if (series_id) {
      createData.Series = { connect: { id: Number(series_id) } };
    }

    if (category_id && !isNaN(Number(category_id))) {
      createData.Category = { connect: { id: Number(category_id) } };
    }

    if (tags && typeof tags === 'string' && tags.trim()) {
      createData.Tag = {
        connectOrCreate: tags.split(',').map((tag: string) => ({
          where: { name: tag.trim() },
          create: { name: tag.trim() },
        })),
      };
    }

    try {
      const post = await this.repository.create({ data: createData });
      return post as unknown as PostInterface;
    } catch (err) {
      console.error('Prisma Create Post Error:', err);
      throw err;
    }
  }

  async update(id: number, user: User, data: UpdatePostDto): Promise<PostInterface> {
    const post = await this.repository.findUnique({
      where: { id },
      select: { id: true, author_id: true, content: true, slug: true, is_pinned: true, cover_image: true, series_order: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    if (!(user as any).can_post) throw new ForbiddenException('Tài khoản của bạn đã bị cấm sửa bài.');

    if (post.author_id !== user.id) throw new ForbiddenException('Bạn chỉ có thể chỉnh sửa bài viết của chính mình.');

    const { tags, slug, category_id, series_id, ...postData } = data;
    const cleanContent = data.content ? sanitizeHtml(data.content, this.sanitizeOptions) : post.content;

    let finalSlug = post.slug;
    if (slug && slug !== post.slug) {
      finalSlug = slugify(slug, { lower: true, strict: true, locale: 'vi' });
      let count = 0;
      let tempSlug = finalSlug;
      while (true) {
        const existing = await this.repository.findFirst({ where: { slug: tempSlug, NOT: { id } }, select: { id: true } });
        if (!existing) break;
        count++;
        tempSlug = `${finalSlug}-${count}`;
      }
      finalSlug = tempSlug;
    }

    const updateData: Record<string, any> = {
      title: postData.title,
      cover_image: postData.cover_image,
      is_published: postData.is_published,
      slug: finalSlug,
      content: cleanContent,
      is_pinned: user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN ? data.is_pinned : post.is_pinned,
      series_order: data.series_order !== undefined ? Number(data.series_order) : post.series_order,
    };

    if (data.series_name && data.series_name.trim()) {
      const seriesName = data.series_name.trim();
      const seriesSlug = slugify(seriesName, { lower: true, strict: true, locale: 'vi' });
      updateData.Series = {
        connectOrCreate: {
          where: { name: seriesName },
          create: { name: seriesName, slug: seriesSlug }
        }
      };
    } else if (series_id !== undefined) {
      updateData.Series = series_id ? { connect: { id: Number(series_id) } } : { disconnect: true };
    }

    if (category_id !== undefined) {
      updateData.Category = category_id ? { connect: { id: Number(category_id) } } : { disconnect: true };
    }

    if (tags !== undefined) {
      updateData.Tag = {
        set: [],
        connectOrCreate: tags?.split(',').map((tag: string) => ({
          where: { name: tag.trim() },
          create: { name: tag.trim() },
        })),
      };
    }

    if (updateData.cover_image && post.cover_image && post.cover_image !== updateData.cover_image) {
      await this.storageService.deleteFile(post.cover_image);
    }

    const updatedPost = await this.repository.update({
      where: { id },
      data: updateData,
      select: { id: true, title: true, slug: true, created_at: true },
    });
    return updatedPost as unknown as PostInterface;
  }

  async remove(id: number, user: User, ip?: string) {
    const post = await this.repository.findUnique({
      where: { id },
      select: { id: true, author_id: true, cover_image: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN && post.author_id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này.');
    }
    if (post.cover_image) await this.storageService.deleteFile(post.cover_image);

    await this.repository.delete({ where: { id } });

    const username = user.username || 'Hệ thống';
    const userIp = ip || 'unknown';

    this.adminAlertService.sendAlert({
      subject: `🗑️ Bài viết bị xóa: ${post.id}`,
      text: `🗑️ <b>BÀI VIẾT BỊ XÓA</b>\n\n• <b>Hành động:</b> Đã xóa bài viết ID #${post.id}\n• <b>IP:</b> ${userIp}\n• <b>User:</b> ${username}\n• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
    });

    return { success: true };
  }

  async togglePin(id: number, user: User, ip?: string) {
    const post = await this.repository.findUnique({ where: { id }, select: { id: true, title: true, author_id: true, is_pinned: true } });
    if (!post) throw new NotFoundException('Post not found');
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN && post.author_id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền ghim bài viết này.');
    }

    const updated = await this.repository.update({ where: { id }, data: { is_pinned: !post.is_pinned }, select: { id: true, title: true, is_pinned: true } });

    const username = user.username || 'Hệ thống';
    const userIp = ip || 'unknown';
    const action = updated.is_pinned ? 'Ghim bài viết' : 'Bỏ ghim bài viết';

    this.adminAlertService.sendAlert({
      subject: `📌 ${action}: ${updated.title}`,
      text: `📌 <b>THAY ĐỔI GHIM BÀI VIẾT</b>\n\n• <b>Hành động:</b> ${action} "${updated.title}"\n• <b>IP:</b> ${userIp}\n• <b>User:</b> ${username}\n• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
    });

    return updated;
  }

  async togglePublish(id: number, user: User, ip?: string, reason?: string) {
    const post = await this.repository.findUnique({ where: { id }, select: { id: true, title: true, author_id: true, is_published: true, is_blocked: true } });
    if (!post) throw new NotFoundException('Post not found');
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN && post.author_id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền thay đổi trạng thái hiển thị của bài viết này.');
    }

    const updates: any = {};
    if ((user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN) && user.id !== post.author_id) {
      updates.is_blocked = !post.is_blocked;
    } else {
      updates.is_published = !post.is_published;
    }

    const updatedPost = await this.repository.update({ where: { id }, data: updates, select: { id: true, title: true, slug: true, is_published: true, is_blocked: true, author_id: true } }) as any;

    const username = user.username || 'Hệ thống';
    const userIp = ip || 'unknown';
    let action = updates.is_blocked !== undefined ? (updates.is_blocked ? 'Khóa bài viết' : 'Mở khóa bài viết') : (updates.is_published ? 'Công khai bài viết' : 'Gỡ bài viết (Lưu nháp)');

    this.adminAlertService.sendAlert({
      subject: `📝 ${action}: ${updatedPost.title}`,
      text: `📝 <b>THAY ĐỔI TRẠNG THÁI BÀI VIẾT</b>\n\n• <b>Hành động:</b> ${action} "${updatedPost.title}"\n• <b>IP:</b> ${userIp}\n• <b>User:</b> ${username}\n• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
    });

    try {
      if (updates.is_blocked !== undefined && user.id !== post.author_id && post.author_id) {
        const reasonText = reason ? ` Lý do: ${reason}` : '';
        await this.notificationsService.create({
          recipient_id: post.author_id, sender_id: user.id, type: 'POST_BLOCKED',
          title: updates.is_blocked ? 'Bài viết bị khóa' : 'Bài viết đã mở khóa',
          content: updates.is_blocked ? `Bài viết "${post.title}" của bạn đã bị quản trị viên khóa.${reasonText}` : `Bài viết "${post.title}" của bạn đã được quản trị viên mở khóa.`,
          link: updates.is_blocked ? '/profile?tab=posts' : `/posts/${updatedPost.slug}`,
        });
      }
    } catch (err) { console.error('Failed to trigger post notification:', err); }

    return updatedPost;
  }

  async toggleLike(id: number, userId: number) {
    const post = await this.repository.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await (this.repository as any).prisma.postLike.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: id } },
    });

    if (existingLike) {
      await (this.repository as any).prisma.postLike.delete({ where: { id: existingLike.id } });
      await this.repository.update({
        where: { id },
        data: { likes: { decrement: 1 } },
      });
      return { liked: false };
    } else {
      await (this.repository as any).prisma.postLike.create({
        data: { user_id: userId, post_id: id },
      });
      await this.repository.update({
        where: { id },
        data: { likes: { increment: 1 } },
      });
      return { liked: true };
    }
  }

  async checkLikeStatus(id: number, userId: number) {
    const existingLike = await (this.repository as any).prisma.postLike.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: id } },
    });
    return { liked: !!existingLike };
  }
}
