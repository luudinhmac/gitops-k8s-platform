import { User } from './user';

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  series_id?: number | null;
  series_order?: number | null;
  cover_image?: string | null;
  is_pinned: boolean;
  is_published: boolean;
  views: number;
  likes: number;
  created_at: Date | string;
  updated_at: Date | string;
  is_blocked: boolean;
  blocked_by_id?: number | null;
  blocked_reason?: string | null;
  BlockedBy?: Partial<User> | null;
  category_id?: number | null;
  author_id?: number | null;
  Author?: Partial<User> | null;
  Category?: any;
  Tag?: any[];
  Series?: any;
  Comment?: any[];
  _count?: {
    Comment: number;
    PostLike: number;
  };
  comment_count?: number;
  readTime?: number;
  prevPost?: Partial<Post> | null;
  nextPost?: Partial<Post> | null;
}

export type PostSortOption = 'newest' | 'oldest' | 'most_viewed' | 'most_liked' | 'latest' | 'views' | 'likes' | 'comments';
export type SortOption = PostSortOption;

export interface CreatePostDto {
  title: string;
  slug?: string | null;
  content?: string | null;
  category_id?: number | null;
  series_id?: number | null;
  series_order?: number | null;
  cover_image?: string | null;
  is_pinned?: boolean;
  is_published?: boolean;
  tags?: string | null;
  series_name?: string | null;
}

export interface UpdatePostDto {
  title?: string | null;
  slug?: string | null;
  content?: string | null;
  category_id?: number | null;
  series_id?: number | null;
  series_order?: number | null;
  cover_image?: string | null;
  is_pinned?: boolean;
  is_published?: boolean;
  is_blocked?: boolean;
  blocked_by_id?: number | null;
  tags?: string | null;
  series_name?: string | null;
}
