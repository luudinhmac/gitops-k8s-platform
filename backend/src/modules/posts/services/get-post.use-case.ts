import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../domain/post.repository.interface';
import { PostEntity } from '../domain/post.entity';
import { PostNotFoundException } from '../domain/post.errors';

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

    if (!post) throw new PostNotFoundException(idOrSlug);
// ...

    if (incrementView) {
      await this.postRepository.incrementView(post.id).catch(() => {});
    }

    const formattedPost = this.formatPost(post);

    if (post.series_id) {
      const neighbors = await this.postRepository.findNeighborsInSeries(post.series_id, post.series_order || 0);
      if (neighbors.prev) {
        const prev = this.formatPost(neighbors.prev);
        prev.prevPost = null; // Prevent deep nesting/circularity
        prev.nextPost = null;
        formattedPost.prevPost = prev;
      } else {
        formattedPost.prevPost = null;
      }
      
      if (neighbors.next) {
        const next = this.formatPost(neighbors.next);
        next.prevPost = null; // Prevent deep nesting/circularity
        next.nextPost = null;
        formattedPost.nextPost = next;
      } else {
        formattedPost.nextPost = null;
      }
    }

    return formattedPost;
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
