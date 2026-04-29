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
