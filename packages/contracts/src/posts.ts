import { IsString, IsOptional, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';
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
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  category_id?: number | null;

  @IsNumber()
  @IsOptional()
  series_id?: number | null;

  @IsNumber()
  @IsOptional()
  series_order?: number | null;

  @IsString()
  @IsOptional()
  cover_image?: string | null;

  @IsBoolean()
  @IsOptional()
  is_pinned?: boolean;

  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  series_name?: string;
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  category_id?: number | null;

  @IsNumber()
  @IsOptional()
  series_id?: number | null;

  @IsNumber()
  @IsOptional()
  series_order?: number | null;

  @IsString()
  @IsOptional()
  cover_image?: string | null;

  @IsBoolean()
  @IsOptional()
  is_pinned?: boolean;

  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  series_name?: string;
}

export type SortOption = 'newest' | 'oldest' | 'most_viewed' | 'most_liked' | 'latest' | 'views' | 'likes' | 'comments';
