import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../domain/post.repository.interface';
import { PostFilter, PaginationParams, PaginatedResult } from '../domain/post.types';
import { PostEntity } from '../domain/post.entity';
import { User, UserRole } from '@portfolio/types';

@Injectable()
export class GetPostsUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {
    console.log('--- GetPostsUseCase INITIALIZED (NO CACHE) ---');
  }

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

    result.items = result.items.map((post: PostEntity) => this.formatPost(post));

    return result;
  }

  private formatPost(post: PostEntity): PostEntity {
    const cleanContent = post.content ? post.content.replace(/<[^>]*>/g, '') : '';
    post.excerpt = post.excerpt || (cleanContent.substring(0, 160).trim() + (cleanContent.length > 160 ? '...' : ''));
    post.readTime = this.calculateReadTime(post.content || '');
    // Note: comment_count and likes are now expected to be populated by the repository
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

