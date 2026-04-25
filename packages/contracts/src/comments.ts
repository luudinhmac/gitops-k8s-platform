import { User } from './users';

export interface Comment {
  id: number;
  post_id?: number;
  user_id?: number;
  parent_id?: number;
  author_name?: string;
  author_email?: string;
  content?: string;
  created_at: Date | string;
  User?: Partial<User>;
  Replies?: Comment[];
}

export interface CreateCommentDto {
  post_id: number;
  parent_id?: number;
  content: string;
  author_name?: string;
  author_email?: string;
}
