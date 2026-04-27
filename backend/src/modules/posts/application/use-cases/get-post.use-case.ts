import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../../domain/repositories/post.repository.interface';
import { PostEntity } from '../../domain/entities/post.entity';

@Injectable()
export class GetPostUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(idOrSlug: string | number, incrementView: boolean = false): Promise<PostEntity> {
    const isId = !isNaN(Number(idOrSlug));
    const post = isId 
      ? await this.postRepository.findById(Number(idOrSlug))
      : await this.postRepository.findBySlug(String(idOrSlug));

    if (!post) throw new NotFoundException('Post not found');

    if (incrementView) {
      await this.postRepository.incrementView(post.id).catch(() => {});
    }

    const formattedPost = this.formatPost(post);

    if (post.series_id) {
      const neighbors = await this.postRepository.findNeighborsInSeries(post.series_id, post.series_order || 0);
      formattedPost.prevPost = neighbors.prev ? this.formatPost(neighbors.prev) : null;
      formattedPost.nextPost = neighbors.next ? this.formatPost(neighbors.next) : null;
    }

    return formattedPost;
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
