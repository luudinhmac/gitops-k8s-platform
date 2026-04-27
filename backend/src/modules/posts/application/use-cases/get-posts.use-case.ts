import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY, PostFilter, PaginationParams, PaginatedResult } from '../../domain/repositories/post.repository.interface';
import { PostEntity } from '../../domain/entities/post.entity';
import { User, UserRole } from '@portfolio/types';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class GetPostsUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(
    user?: User,
    isAdmin: boolean = false,
    query?: string,
    status?: string,
    sort?: string,
    userId?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<PostEntity>> {
    // Only cache public lists (no user, not admin)
    const canCache = !user && !isAdmin && !query;
    const cacheKey = `posts_list_p${page}_l${limit}_s${sort || 'latest'}_u${userId || 'all'}`;

    if (canCache) {
      const cached = await this.cacheManager.get<PaginatedResult<PostEntity>>(cacheKey);
      if (cached) return cached;
    }

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
    const result = await this.postRepository.findAll(filter, pagination);

    // Format posts (excerpt, readTime) - this could be in a domain service or entity
    result.items = result.items.map(post => this.formatPost(post));

    if (canCache) {
      await this.cacheManager.set(cacheKey, result, 300000); // 5 minutes
    }

    return result;
  }

  private formatPost(post: PostEntity): PostEntity {
    const cleanContent = post.content ? post.content.replace(/<[^>]*>/g, '') : '';
    post.excerpt = post.excerpt || (cleanContent.substring(0, 160).trim() + (cleanContent.length > 160 ? '...' : ''));
    post.readTime = this.calculateReadTime(post.content || '');
    post.comment_count = (post as any)._count?.Comment || 0;
    post.likes = (post as any)._count?.PostLike || post.likes || 0;
    return post;
  }

  private calculateReadTime(content: string): number {
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
}
