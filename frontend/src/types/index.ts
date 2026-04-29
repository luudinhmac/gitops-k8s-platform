import { components } from './api.generated';

// Export schemas as convenient types
export type Post = components['schemas']['Post'];
export type CreatePostDto = components['schemas']['CreatePostDto'];
export type UpdatePostDto = components['schemas']['UpdatePostDto'];

export type User = components['schemas']['User'];
export type UserRole = User['role'];
export type CreateUserDto = components['schemas']['CreateUserDto'];
export type UpdateUserDto = components['schemas']['UpdateUserDto'];

export type Category = components['schemas']['Category'];
export type CreateCategoryDto = components['schemas']['CreateCategoryDto'];
export type UpdateCategoryDto = components['schemas']['UpdateCategoryDto'];

export type Series = components['schemas']['Series'];
export type CreateSeriesDto = components['schemas']['CreateSeriesDto'];
export type UpdateSeriesDto = components['schemas']['UpdateSeriesDto'];

export type LoginDto = components['schemas']['LoginDto'];
export type RegisterDto = components['schemas']['RegisterDto'];

export type Comment = components['schemas']['Comment'];
export type CreateCommentDto = components['schemas']['CreateCommentDto'];
export type UpdateCommentDto = components['schemas']['UpdateCommentDto'];

export type Notification = components['schemas']['Notification'];



export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type PostSortOption = 'newest' | 'oldest' | 'most_viewed' | 'most_liked' | 'latest' | 'views' | 'likes' | 'comments';
export type SortOption = PostSortOption;


// Add more exports as we improve other modules
// export type User = components['schemas']['User'];
