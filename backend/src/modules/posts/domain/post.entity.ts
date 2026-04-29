import { User } from '@portfolio/types';

export class PostEntity {
  id!: number;
  title!: string;
  slug!: string;
  excerpt?: string | null;
  content?: string | null;
  series_id?: number | null;
  series_order?: number | null;
  cover_image?: string | null;
  is_pinned!: boolean;
  is_published!: boolean;
  views!: number;
  likes!: number;
  created_at!: Date;
  updated_at!: Date;
  is_blocked!: boolean;
  blocked_by_id?: number | null;
  blocked_reason?: string | null;
  category_id?: number | null;
  author_id?: number | null;

  // Relations
  Author?: Partial<User> | null;
  Category?: any;
  Series?: any;
  Comment?: any[];
  Tag?: any[];

  // Formatted data / UI helpers (should be populated by repository or service)
  comment_count?: number;
  readTime?: number;
  prevPost?: Partial<PostEntity> | null;
  nextPost?: Partial<PostEntity> | null;

  constructor(props: Partial<PostEntity>) {
    Object.assign(this, props);
    
    // Convert string dates to Date objects if necessary
    if (typeof this.created_at === 'string') this.created_at = new Date(this.created_at);
    if (typeof this.updated_at === 'string') this.updated_at = new Date(this.updated_at);
  }

  public isVisibleTo(userId?: number): boolean {
    if (this.is_published && !this.is_blocked) return true;
    if (userId && this.author_id === userId) return true;
    return false;
  }
}
