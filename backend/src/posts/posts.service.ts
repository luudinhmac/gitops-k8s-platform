import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import { User, UserRole } from '../users/interfaces/user.interface';
import { Post as PostInterface } from './interfaces/post.interface';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';
import { Prisma } from '@prisma/client';
import { FileService } from '../upload/file.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AdminAlertService } from '../admin-alert/admin-alert.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private notificationsService: NotificationsService,
    private adminAlertService: AdminAlertService,
  ) {}

  private sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'span',
      'div',
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'blockquote',
      'pre',
      'ol',
      'ul',
      'li',
      'a',
    ]),
    allowedAttributes: {
      '*': ['style', 'class', 'id', 'align'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'style'],
    },
    allowedStyles: {
      '*': {
        // Allow all common rich text styles
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
  ): Promise<PostInterface[]> {
    const where: Prisma.PostWhereInput = {};
    if (!isAdmin) {
      where.is_published = true;
      where.is_blocked = false;
    } else if (user) {
      if (user.role === (UserRole.ADMIN as string)) {
        where.OR = [
          { author_id: user.id }, // Own drafts
          { is_published: true }, // Published posts of others (including blocked ones)
        ];
      } else {
        where.author_id = user.id; // User sees all their own posts (Draft/Published/Blocked)
      }
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        {
          Tag: {
            some: { name: { contains: query, mode: 'insensitive' } },
          },
        },
        {
          Category: {
            name: { contains: query, mode: 'insensitive' },
          },
        },
        {
          Series: {
            name: { contains: query, mode: 'insensitive' },
          },
        },
      ];
    }

    const select: any = {
      id: true,
      title: true,
      slug: true,
      cover_image: true,
      is_pinned: true,
      is_published: true,
      is_blocked: true,
      views: true,
      likes: true,
      created_at: true,
      updated_at: true,
      author_id: true,
      series_id: true,
      series_order: true,
      Category: {
        select: { id: true, name: true, slug: true }
      },
      User: {
        select: { id: true, fullname: true, username: true, avatar: true },
      },
      Tag: {
        select: { id: true, name: true }
      },
      Series: {
        select: { id: true, name: true, slug: true }
      },
      _count: {
        select: { Comment: true, PostLike: true },
      },
    };

    const posts = await (this.prisma.post as any).findMany({
      where,
      orderBy: [{ is_pinned: 'desc' }, { created_at: 'desc' }],
      select,
    });
    return posts as unknown as PostInterface[];
  }

  async findOne(
    idOrSlug: string | number,
    incrementView: boolean = false,
  ): Promise<PostInterface> {
    const isId = !isNaN(Number(idOrSlug));
    const where: Prisma.PostWhereUniqueInput = isId
      ? { id: Number(idOrSlug) }
      : { slug: String(idOrSlug) };

    if (incrementView) {
      try {
        await this.prisma.post.update({
          where,
          data: { views: { increment: 1 } },
        });
      } catch (err) {
        console.error('Error incrementing view:', err);
      }
    }

    const select: any = {
      id: true,
      title: true,
      content: true,
      slug: true,
      cover_image: true,
      is_pinned: true,
      is_published: true,
      is_blocked: true,
      views: true,
      likes: true,
      created_at: true,
      updated_at: true,
      series_id: true,
      series_order: true,
      category_id: true,
      author_id: true,
      Category: {
        select: { id: true, name: true, slug: true }
      },
      User: {
        select: { fullname: true, avatar: true, username: true },
      },
      Tag: {
        select: { id: true, name: true }
      },
      Series: {
        select: { id: true, name: true, slug: true }
      },
      Comment: {
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          content: true,
          author_name: true,
          author_email: true,
          created_at: true,
          user_id: true,
          parent_id: true,
          User: {
            select: { avatar: true, fullname: true, username: true },
          },
        },
      },
      _count: {
        select: { Comment: true, PostLike: true },
      },
    };

    let post = await (this.prisma.post as any).findUnique({
      where,
      select,
    });

    // If numeric slug and not found by ID, try searching by slug
    if (!post && isId) {
      post = await (this.prisma.post as any).findUnique({
        where: { slug: String(idOrSlug) },
        select,
      });
    }

    if (!post) throw new NotFoundException('Post not found');

    // Fetch next/prev posts if in a series
    let prevPost: Partial<PostInterface> | null = null;
    let nextPost: Partial<PostInterface> | null = null;
    if (post.series_id) {
      const currentOrder = post.series_order ?? 0;
      [prevPost, nextPost] = await Promise.all([
        this.prisma.post.findFirst({
          where: {
            series_id: post.series_id,
            is_published: true,
            OR: [
              { series_order: { lt: currentOrder } },
              {
                series_order: currentOrder,
                created_at: { lt: post.created_at },
              },
            ],
          },
          orderBy: [{ series_order: 'desc' }, { created_at: 'desc' }],
          select: {
            id: true,
            title: true,
            slug: true,
            Category: { select: { slug: true } },
          },
        }) as Promise<Partial<PostInterface> | null>,
        this.prisma.post.findFirst({
          where: {
            series_id: post.series_id,
            is_published: true,
            OR: [
              { series_order: { gt: currentOrder } },
              {
                series_order: currentOrder,
                created_at: { gt: post.created_at },
              },
            ],
          },
          orderBy: [{ series_order: 'asc' }, { created_at: 'asc' }],
          select: {
            id: true,
            title: true,
            slug: true,
            Category: { select: { slug: true } },
          },
        }) as Promise<Partial<PostInterface> | null>,
      ]);
    }

    return { ...post, prevPost, nextPost } as unknown as PostInterface;
  }

  async create(user: User, data: CreatePostDto): Promise<PostInterface> {
    if (!(user as any).can_post) {
      throw new ForbiddenException('Tài khoản của bạn đã bị cấm đăng bài.');
    }
    const {
      title,
      content,
      slug,
      category_id,
      series_id,
      series_order,
      cover_image,
      is_pinned,
      is_published,
      tags,
    } = data;
    const cleanContent = sanitizeHtml(content || '', this.sanitizeOptions);

    // Generate unique slug
    const baseSlug =
      slug || slugify(title, { lower: true, strict: true, locale: 'vi' });
    let finalSlug = baseSlug;
    let count = 0;
    while (true) {
      const existing = await this.prisma.post.findUnique({
        where: { slug: finalSlug },
      });
      if (!existing) break;
      count++;
      finalSlug = `${baseSlug}-${count}`;
    }

    const createData: Prisma.PostCreateInput = {
      title,
      slug: finalSlug,
      content: cleanContent,
      cover_image: cover_image || null,
      is_pinned:
        user.role === (UserRole.ADMIN as string) && is_pinned ? true : false,
      is_published: is_published !== undefined ? is_published : true,
      User: { connect: { id: user.id } },
      Series: series_id ? { connect: { id: Number(series_id) } } : undefined,
      series_order: series_order ? Number(series_order) : 0,
    };

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
      const post = await this.prisma.post.create({
        data: createData,
      });
      return post as unknown as PostInterface;
    } catch (err) {
      console.error('Prisma Create Post Error:', err);
      throw err;
    }
  }

  async update(
    id: number,
    user: User,
    data: UpdatePostDto,
  ): Promise<PostInterface> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { id: true, author_id: true, content: true, slug: true, is_pinned: true, cover_image: true, series_order: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    if (!(user as any).can_post) {
      throw new ForbiddenException('Tài khoản của bạn đã bị cấm sửa bài.');
    }

    if (post.author_id !== user.id) {
      throw new ForbiddenException(
        'Bạn chỉ có thể chỉnh sửa bài viết của chính mình.',
      );
    }

    const { tags, slug, category_id, series_id, ...postData } = data;
    const cleanContent = data.content
      ? sanitizeHtml(data.content, this.sanitizeOptions)
      : post.content;

    // Handle slug update if provided and different
    let finalSlug = post.slug;
    if (slug && slug !== post.slug) {
      finalSlug = slugify(slug, { lower: true, strict: true, locale: 'vi' });
      // Ensure unique
      let count = 0;
      let tempSlug = finalSlug;
      while (true) {
        const existing = await this.prisma.post.findFirst({
          where: { slug: tempSlug, NOT: { id } },
          select: { id: true },
        });
        if (!existing) break;
        count++;
        tempSlug = `${finalSlug}-${count}`;
      }
      finalSlug = tempSlug;
    }

    const updateData: Prisma.PostUpdateInput = {
      title: postData.title,
      cover_image: postData.cover_image,
      is_published: postData.is_published,
      slug: finalSlug,
      content: cleanContent,
      is_pinned:
        user.role === (UserRole.ADMIN as string)
          ? data.is_pinned
          : post.is_pinned,
      Series:
        series_id !== undefined
          ? series_id
            ? { connect: { id: Number(series_id) } }
            : { disconnect: true }
          : undefined,
      series_order:
        data.series_order !== undefined
          ? Number(data.series_order)
          : post.series_order,
    };

    if (category_id !== undefined) {
      updateData.Category = category_id
        ? { connect: { id: Number(category_id) } }
        : { disconnect: true };
    }

    if (tags !== undefined) {
      updateData.Tag = {
        set: [], // Clear old tags
        connectOrCreate: tags?.split(',').map((tag: string) => ({
          where: { name: tag.trim() },
          create: { name: tag.trim() },
        })),
      };
    }

    // Cleanup old cover image if it's being updated
    if (
      updateData.cover_image &&
      post.cover_image &&
      post.cover_image !== updateData.cover_image
    ) {
      await this.fileService.deleteFile(post.cover_image);
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updateData,
      select: { id: true, title: true, slug: true, created_at: true },
    });
    return updatedPost as unknown as PostInterface;
  }

  async remove(id: number, user: User, ip?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { id: true, author_id: true, cover_image: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    if (
      user.role !== (UserRole.ADMIN as string) &&
      post.author_id !== user.id
    ) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này.');
    }
    // Cleanup cover image if exists
    if (post.cover_image) {
      await this.fileService.deleteFile(post.cover_image);
    }

    await this.prisma.post.delete({ where: { id } });

    // --- AUDIT ALERT ---
    const username = user.username || 'Hệ thống';
    const userIp = ip || 'unknown';

    this.adminAlertService.sendAlert({
      subject: `🗑️ Bài viết bị xóa: ${post.id}`,
      text: `🗑️ <b>BÀI VIẾT BỊ XÓA</b>\n\n` +
            `• <b>Hành động:</b> Đã xóa bài viết ID #${post.id}\n` +
            `• <b>IP:</b> ${userIp}\n` +
            `• <b>User:</b> ${username}\n` +
            `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
    });

    return { success: true };
  }

  async togglePin(id: number, user: User, ip?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { id: true, title: true, author_id: true, is_pinned: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    if (
      user.role !== (UserRole.ADMIN as string) &&
      post.author_id !== user.id
    ) {
      throw new ForbiddenException('Bạn không có quyền ghim bài viết này.');
    }

    const updated = await this.prisma.post.update({
      where: { id },
      data: { is_pinned: !post.is_pinned },
      select: { id: true, title: true, is_pinned: true },
    });

    // --- AUDIT ALERT ---
    const username = user.username || 'Hệ thống';
    const userIp = ip || 'unknown';
    const action = updated.is_pinned ? 'Ghim bài viết' : 'Bỏ ghim bài viết';

    this.adminAlertService.sendAlert({
      subject: `📌 ${action}: ${updated.title}`,
      text: `📌 <b>THAY ĐỔI GHIM BÀI VIẾT</b>\n\n` +
            `• <b>Hành động:</b> ${action} "${updated.title}"\n` +
            `• <b>IP:</b> ${userIp}\n` +
            `• <b>User:</b> ${username}\n` +
            `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
    });

    return updated;
  }

  async toggleLike(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await this.prisma.postLike.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: id } },
    });

    if (existingLike) {
      await this.prisma.postLike.delete({ where: { id: existingLike.id } });
      await this.prisma.post.update({
        where: { id },
        data: { likes: { decrement: 1 } },
      });
      return { liked: false };
    } else {
      await this.prisma.postLike.create({
        data: { user_id: userId, post_id: id },
      });
      await this.prisma.post.update({
        where: { id },
        data: { likes: { increment: 1 } },
      });
      return { liked: true };
    }
  }

  async checkLikeStatus(id: number, userId: number) {
    const existingLike = await this.prisma.postLike.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: id } },
    });
    return { liked: !!existingLike };
  }

  async togglePublish(id: number, user: User, ip?: string, reason?: string) {
    const post = await (this.prisma.post as any).findUnique({
      where: { id },
      select: { id: true, title: true, author_id: true, is_published: true, is_blocked: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    if (
      user.role !== (UserRole.ADMIN as string) &&
      post.author_id !== user.id
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền thay đổi trạng thái hiển thị của bài viết này.',
      );
    }

    // Logic: If Admin is hiding another user's post -> Block it
    // If Admin/User is hiding their own post -> Unpublish (Draft)
    const updates: any = {};
    if (user.role === (UserRole.ADMIN as string) && user.id !== post.author_id) {
      updates.is_blocked = !post.is_blocked;
    } else {
      updates.is_published = !post.is_published;
    }

    const updatedPost = await (this.prisma.post as any).update({
      where: { id },
      data: updates,
      select: { id: true, title: true, slug: true, is_published: true, is_blocked: true, author_id: true },
    });

    // --- AUDIT ALERT ---
    const username = user.username || 'Hệ thống';
    const userIp = ip || 'unknown';
    let action = '';
    if (updates.is_blocked !== undefined) {
      action = updates.is_blocked ? 'Khóa bài viết' : 'Mở khóa bài viết';
    } else {
      action = updates.is_published ? 'Công khai bài viết' : 'Gỡ bài viết (Lưu nháp)';
    }

    this.adminAlertService.sendAlert({
      subject: `📝 ${action}: ${updatedPost.title}`,
      text: `📝 <b>THAY ĐỔI TRẠNG THÁI BÀI VIẾT</b>\n\n` +
            `• <b>Hành động:</b> ${action} "${updatedPost.title}"\n` +
            `• <b>IP:</b> ${userIp}\n` +
            `• <b>User:</b> ${username}\n` +
            `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
    });

    // --- TRIGGER NOTIFICATIONS (Legacy) ---
    try {
      if (updates.is_blocked !== undefined && user.id !== post.author_id) {
        const reasonText = reason ? ` Lý do: ${reason}` : '';
        await this.notificationsService.create({
          recipient_id: post.author_id,
          sender_id: user.id,
          type: 'POST_BLOCKED',
          title: updates.is_blocked ? 'Bài viết bị khóa' : 'Bài viết đã mở khóa',
          content: updates.is_blocked 
            ? `Bài viết "${post.title}" của bạn đã bị quản trị viên khóa.${reasonText}` 
            : `Bài viết "${post.title}" của bạn đã được quản trị viên mở khóa.`,
          link: updates.is_blocked ? '/profile?tab=posts' : `/posts/${updatedPost.slug}`,
        });
      }
    } catch (err) {
      console.error('Failed to trigger post notification:', err);
    }

    return updatedPost;
  }
}
