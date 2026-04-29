import { User } from '@portfolio/types';

export class CommentEntity {
  id!: number;
  post_id!: number;
  user_id?: number | null;
  parent_id?: number | null;
  content!: string;
  author_name?: string | null;
  author_email?: string | null;
  created_at!: Date;
  updated_at!: Date;

  // Relations
  User?: Partial<User> | null;
  Replies?: CommentEntity[];

  constructor(partial: Partial<CommentEntity>) {
    Object.assign(this, partial);
    
    if (typeof this.created_at === 'string') this.created_at = new Date(this.created_at);
    if (typeof this.updated_at === 'string') this.updated_at = new Date(this.updated_at);
  }

  public getAuthorDisplayName(): string {
    if (this.User) {
      return this.User.fullname || this.User.username || 'Thành viên';
    }
    return this.author_name || 'Khách';
  }
}
