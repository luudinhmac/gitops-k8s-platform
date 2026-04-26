import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import { User, UserRole, Post as PostInterface, CreatePostDto, UpdatePostDto } from '@portfolio/contracts';
import { NotificationsService } from '../notifications/notifications.service';
import { AdminAlertService } from '../admin-alert/admin-alert.service';
import { IPostsRepository, I_POSTS_REPOSITORY } from './repositories/post.repository.interface';
import { IStorageService, STORAGE_SERVICE } from '../../infrastructure/storage/storage.interface';
import { PostStatus, PostSort, PostFilter, PaginationParams, PaginatedResult } from './domain/post.types';
import { PostEntity } from './domain/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject(I_POSTS_REPOSITORY) private repository: IPostsRepository,
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
        color: [/.*/],
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
  ): Promise<PaginatedResult<PostInterface>> {
    const filter: PostFilter = {
      search: query,
      is_published: status === 'published' ? true : (status === 'draft' ? false : undefined),
      is_blocked: status === 'blocked' ? true : (isAdmin ? undefined : false),
      author_id: userId,
      viewer_id: user?.id,
      sortBy: sort === 'views' ? 'views' : (sort === 'likes' ? 'likes' : (sort === 'comments' ? 'comments' : 'created_at')),
      sortOrder: 'desc',
    };

    if (isAdmin && user && !userId) {
      if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
        filter.author_id = user.id;
      }
    }

    const pagination: PaginationParams = { page, limit };
    const result = await this.repository.findAll(filter, pagination);

    return {
      ...result,
      items: result.items.map(post => this.formatPost(post)),
    };
  }

  private formatPost(post: any): PostInterface {
    const cleanContent = post.content ? post.content.replace(/<[^>]*>/g, '') : '';
    return {
      ...post,
      excerpt: post.excerpt || (cleanContent.substring(0, 160).trim() + (cleanContent.length > 160 ? '...' : '')),
      readTime: this.calculateReadTime(post.content),
      comment_count: post._count?.Comment || 0,
      likes: post._count?.PostLike || post.likes || 0,
    } as unknown as PostInterface;
  }

  async findOne(idOrSlug: string | number, incrementView: boolean = false): Promise<PostInterface> {
    const isId = !isNaN(Number(idOrSlug));
    const post = isId 
      ? await this.repository.findById(Number(idOrSlug))
      : await this.repository.findBySlug(String(idOrSlug));

    if (!post) throw new NotFoundException('Post not found');

    if (incrementView) {
      await this.repository.incrementView(post.id).catch(() => {});
    }

    const formattedPost = this.formatPost(post);

    if (post.series_id) {
      const neighbors = await this.repository.findNeighborsInSeries(post.series_id, post.series_order || 0);
      formattedPost.prevPost = neighbors.prev ? this.formatPost(neighbors.prev) : null;
      formattedPost.nextPost = neighbors.next ? this.formatPost(neighbors.next) : null;
    }

    return formattedPost;
  }

  async create(user: User, data: CreatePostDto): Promise<PostInterface> {
    if (!(user as any).can_post) throw new ForbiddenException('Tài khoản bị cấm đăng bài.');

    const cleanContent = sanitizeHtml(data.content || '', this.sanitizeOptions);
    const baseSlug = data.slug || slugify(data.title, { lower: true, strict: true, locale: 'vi' });
    
    let finalSlug = baseSlug;
    let count = 0;
    while (true) {
      const existing = await this.repository.findBySlug(finalSlug);
      if (!existing) break;
      count++;
      finalSlug = `${baseSlug}-${count}`;
    }

    const post = await this.repository.create(user.id, {
      ...data,
      content: cleanContent,
      slug: finalSlug,
      is_pinned: (user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN) && data.is_pinned ? true : false,
    });

    return this.formatPost(post);
  }

  async update(id: number, user: User, data: UpdatePostDto): Promise<PostInterface> {
    const post = await this.repository.findById(id);
    if (!post) throw new NotFoundException('Post not found');

    if (!(user as any).can_post) throw new ForbiddenException('Tài khoản bị cấm sửa bài.');
    if (post.author_id !== user.id) {
      throw new ForbiddenException('Bạn chỉ có thể chỉnh sửa bài viết của chính mình.');
    }

    const cleanContent = data.content ? sanitizeHtml(data.content, this.sanitizeOptions) : post.content;
    let finalSlug = post.slug;
    if (data.slug && data.slug !== post.slug) {
      const base = slugify(data.slug, { lower: true, strict: true, locale: 'vi' });
      let temp = base;
      let count = 0;
      while (true) {
        const ex = await this.repository.findBySlug(temp);
        if (!ex || ex.id === id) break;
        count++;
        temp = `${base}-${count}`;
      }
      finalSlug = temp;
    }

    const updated = await this.repository.update(id, {
      ...data,
      content: cleanContent,
      slug: finalSlug,
    });

    if (data.cover_image && post.cover_image && post.cover_image !== data.cover_image) {
      await this.storageService.deleteFile(post.cover_image).catch(() => {});
    }

    return this.formatPost(updated);
  }

  async remove(id: number, user: User, ip?: string) {
    const post = await this.repository.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN && post.author_id !== user.id) {
      throw new ForbiddenException('Không có quyền xóa bài viết này.');
    }

    if (post.cover_image) await this.storageService.deleteFile(post.cover_image).catch(() => {});
    await this.repository.delete(id);

    this.adminAlertService.sendAlert({
      subject: `🗑️ Bài viết bị xóa: ${id}`,
      text: `🗑️ <b>BÀI VIẾT BỊ XÓA</b>\n\n• ID: #${id}\n• User: ${user.username}`,
    });

    return { success: true };
  }

  async togglePin(id: number, user: User, ip?: string) {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Chỉ Admin mới có thể ghim bài viết.');
    }
    const post = await this.repository.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    if (post.author_id !== user.id && user.role !== UserRole.SUPERADMIN) {
       // Allow superadmin to pin anything? or only author/admin of their own?
       // Usually admin can pin any post.
    }
    return this.repository.togglePin(id);
  }

  async togglePublish(id: number, user: User, ip?: string, reason?: string) {
    const post = await this.repository.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    
    const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN;
    const isOwn = post.author_id === user.id;

    if (isAdmin && !isOwn) {
      if (post.is_blocked) {
        return this.repository.update(id, { is_blocked: false, blocked_by_id: null });
      }
      if (post.is_published) {
        return this.repository.update(id, { 
          is_published: false, 
          is_blocked: true, 
          blocked_by_id: user.id 
        });
      }
      throw new ForbiddenException('Admin không thể xuất bản bản nháp của người khác.');
    }

    if (isOwn) {
      if (post.is_blocked) {
        const adminName = post.BlockedBy?.fullname || 'Administrator';
        throw new ForbiddenException(`Bài viết bị ẩn bởi ${adminName}. Vui lòng liên hệ để được mở khóa.`);
      }
      return this.repository.togglePublish(id, reason);
    }

    throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này.');
  }

  async toggleLike(id: number, userId: number) {
    return this.repository.toggleLike(id, userId);
  }

  async checkLikeStatus(id: number, userId: number) {
    return this.repository.checkLikeStatus(id, userId);
  }
}
