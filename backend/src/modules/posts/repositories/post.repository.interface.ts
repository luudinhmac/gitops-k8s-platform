import { PostEntity } from '../domain/post.entity';
import { PostFilter, PaginationParams, PaginatedResult } from '../domain/post.types';
import { CreatePostDto, UpdatePostDto } from '@portfolio/contracts';

export const I_POSTS_REPOSITORY = 'I_POSTS_REPOSITORY';

export interface IPostsRepository {
  findAll(filter: PostFilter, pagination: PaginationParams): Promise<PaginatedResult<PostEntity>>;
  findById(id: number): Promise<PostEntity | null>;
  findBySlug(slug: string): Promise<PostEntity | null>;
  create(authorId: number, data: CreatePostDto): Promise<PostEntity>;
  update(id: number, data: UpdatePostDto): Promise<PostEntity>;
  delete(id: number): Promise<void>;
  count(filter: PostFilter): Promise<number>;
  incrementView(id: number): Promise<void>;
  toggleLike(postId: number, userId: number): Promise<{ liked: boolean }>;
  checkLikeStatus(postId: number, userId: number): Promise<{ liked: boolean }>;
  togglePin(id: number): Promise<PostEntity>;
  togglePublish(id: number, reason?: string): Promise<PostEntity>;
  findNeighborsInSeries(seriesId: number, currentOrder: number): Promise<{ prev: any | null; next: any | null }>;
}
