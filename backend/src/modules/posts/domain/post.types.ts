export enum PostStatus {
  ALL = 'all',
  PUBLISHED = 'published',
  DRAFT = 'draft',
  BLOCKED = 'blocked',
}

export enum PostSort {
  LATEST = 'latest',
  VIEWS = 'views',
  LIKES = 'likes',
  COMMENTS = 'comments',
}

export interface PostFilter {
  is_published?: boolean;
  category_id?: number;
  author_id?: number;
  series_id?: number;
  is_pinned?: boolean;
  is_blocked?: boolean;
  viewer_id?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
