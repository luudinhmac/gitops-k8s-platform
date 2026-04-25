import { User } from './users';

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
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
  category_id?: number | null;
  author_id?: number | null;
  User?: Partial<User>;
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
  prevPost?: any;
  nextPost?: any;
}

export class CreatePostDto {
  title: string;
  slug?: string;
  content?: string;
  category_id?: number | null;
  series_id?: number | null;
  series_order?: number | null;
  cover_image?: string | null;
  is_pinned?: boolean;
  is_published?: boolean;
  tags?: string;
  series_name?: string;
}

export class UpdatePostDto {
  title?: string;
  slug?: string;
  content?: string;
  category_id?: number | null;
  series_id?: number | null;
  series_order?: number | null;
  cover_image?: string | null;
  is_pinned?: boolean;
  is_published?: boolean;
  tags?: string;
  series_name?: string;
}

export type SortOption = 'newest' | 'oldest' | 'most_viewed' | 'most_liked' | 'latest' | 'views' | 'likes' | 'comments';
