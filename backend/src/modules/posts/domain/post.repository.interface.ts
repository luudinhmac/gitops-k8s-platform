import { PostEntity } from './post.entity';
import { PostFilter, PaginationParams, PaginatedResult } from './post.types';
import { CreatePostDto, UpdatePostDto } from '@portfolio/contracts';

export const I_POST_REPOSITORY = 'I_POST_REPOSITORY';

export interface IPostRepository {
  findAll(filter: PostFilter, pagination: PaginationParams): Promise<PaginatedResult<PostEntity>>;
  findById(id: number): Promise<PostEntity | null>;
  findBySlug(slug: string): Promise<PostEntity | null>;
  create(authorId: number, data: CreatePostDto): Promise<PostEntity>;
  update(id: number, data: UpdatePostDto): Promise<PostEntity>;
  delete(id: number): Promise<void>;
  incrementView(id: number): Promise<void>;
  togglePin(id: number): Promise<PostEntity>;
  togglePublish(id: number, reason?: string): Promise<PostEntity>;
  toggleLike(postId: number, userId: number): Promise<{ liked: boolean }>;
  checkLikeStatus(postId: number, userId: number): Promise<{ liked: boolean }>;
  findNeighborsInSeries(seriesId: number, currentOrder: number): Promise<{ prev: PostEntity | null; next: PostEntity | null }>;
}
