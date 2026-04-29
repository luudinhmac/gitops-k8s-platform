import { IsString, IsOptional, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './users';
import { Tag } from './tags';
import { Category } from './categories';
import { Comment } from './comments';
import { Series } from './series';

export class PostCount {
  @ApiProperty()
  Comment: number;

  @ApiProperty()
  PostLike: number;
}

export class Post {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false })
  excerpt?: string;

  @ApiProperty({ required: false })
  content?: string;

  @ApiProperty({ required: false, nullable: true })
  series_id?: number | null;

  @ApiProperty({ required: false, nullable: true })
  series_order?: number | null;

  @ApiProperty({ required: false, nullable: true })
  cover_image?: string | null;

  @ApiProperty()
  is_pinned: boolean;

  @ApiProperty()
  is_published: boolean;

  @ApiProperty()
  views: number;

  @ApiProperty()
  likes: number;

  @ApiProperty({ type: String })
  created_at: Date | string;

  @ApiProperty({ type: String })
  updated_at: Date | string;

  @ApiProperty()
  is_blocked: boolean;

  @ApiProperty({ required: false, nullable: true })
  blocked_by_id?: number | null;

  @ApiProperty({ required: false, nullable: true })
  blocked_reason?: string | null;

  @ApiProperty({ required: false })
  BlockedBy?: Partial<User>;

  @ApiProperty({ required: false, nullable: true })
  category_id?: number | null;

  @ApiProperty({ required: false, nullable: true })
  author_id?: number | null;

  @ApiProperty({ required: false })
  Author?: Partial<User>;

  @ApiProperty({ required: false, type: () => Category })
  Category?: Category;

  @ApiProperty({ required: false, type: () => [Tag] })
  Tag?: Tag[];

  @ApiProperty({ required: false, type: () => Series })
  Series?: Series;

  @ApiProperty({ required: false, type: () => [Comment] })
  Comment?: Comment[];

  @ApiProperty({ required: false, type: () => PostCount })
  _count?: PostCount;

  @ApiProperty({ required: false })
  comment_count?: number;

  @ApiProperty({ required: false })
  readTime?: number;

  @ApiProperty({ required: false, type: () => Post })
  prevPost?: Post;

  @ApiProperty({ required: false, type: () => Post })
  nextPost?: Post;
}

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsNumber()
  @IsOptional()
  category_id?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsNumber()
  @IsOptional()
  series_id?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsNumber()
  @IsOptional()
  series_order?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsString()
  @IsOptional()
  cover_image?: string | null;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_pinned?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tags?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  series_name?: string;
}

export class UpdatePostDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsNumber()
  @IsOptional()
  category_id?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsNumber()
  @IsOptional()
  series_id?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsNumber()
  @IsOptional()
  series_order?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsString()
  @IsOptional()
  cover_image?: string | null;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_pinned?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_blocked?: boolean;

  @ApiProperty({ required: false, nullable: true })
  @IsNumber()
  @IsOptional()
  blocked_by_id?: number | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tags?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  series_name?: string;
}

export type SortOption = 'newest' | 'oldest' | 'most_viewed' | 'most_liked' | 'latest' | 'views' | 'likes' | 'comments';
