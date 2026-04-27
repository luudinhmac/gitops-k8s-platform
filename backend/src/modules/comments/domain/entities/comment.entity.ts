export class CommentEntity {
  id: number;
  post_id: number;
  user_id?: number | null;
  parent_id?: number | null;
  content: string;
  author_name?: string | null;
  author_email?: string | null;
  created_at: Date;
  updated_at: Date;
  User?: any;
  Replies?: CommentEntity[];

  constructor(partial: Partial<CommentEntity>) {
    Object.assign(this, partial);
  }
}
