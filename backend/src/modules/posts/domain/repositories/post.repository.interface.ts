import { PostEntity } from '../entities/post.entity';

export interface PostFilter {
  search?: string;
  category_id?: number;
  author_id?: number;
  is_published?: boolean;
  is_blocked?: boolean;
  is_pinned?: boolean;
  series_id?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  viewer_id?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const I_POST_REPOSITORY = 'I_POST_REPOSITORY';

export interface IPostRepository {
  findAll(filter: PostFilter, pagination: PaginationParams): Promise<PaginatedResult<PostEntity>>;
  findById(id: number): Promise<PostEntity | null>;
  findBySlug(slug: string): Promise<PostEntity | null>;
  create(authorId: number, data: any): Promise<PostEntity>;
  update(id: number, data: any): Promise<PostEntity>;
  delete(id: number): Promise<void>;
  incrementView(id: number): Promise<void>;
  toggleLike(postId: number, userId: number): Promise<{ liked: boolean }>;
  checkLikeStatus(postId: number, userId: number): Promise<{ liked: boolean }>;
  togglePin(id: number): Promise<PostEntity>;
  togglePublish(id: number, reason?: string): Promise<PostEntity>;
  findNeighborsInSeries(seriesId: number, currentOrder: number): Promise<{ prev: PostEntity | null; next: PostEntity | null }>;
}
