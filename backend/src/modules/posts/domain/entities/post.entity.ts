import { Post } from '@portfolio/types';

/**
 * Pure Domain Entity for Post.
 * Free from NestJS, Prisma, or other infrastructure concerns.
 */
export class PostEntity implements Post {
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
  category_id?: number | null;
  author_id?: number | null;

  // Relations (optional in entity, usually handled by mappers)
  Author?: any;
  Category?: any;
  Series?: any;
  Comment?: any[];
  Tag?: any[];
  _count?: {
    Comment: number;
    PostLike: number;
  };

  // UI helpers (from contract)
  comment_count?: number;
  readTime?: number;
  prevPost?: any;
  nextPost?: any;

  constructor(props: Post) {
    Object.assign(this, props);
  }

  // Domain logic example:
  public isPublished(): boolean {
    return this.is_published && !this.is_blocked;
  }
}
