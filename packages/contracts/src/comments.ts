import { User } from './users';

export interface Comment {
  id: number;
  post_id?: number;
  author_name?: string;
  author_email?: string;
  content?: string;
  created_at: Date | string;
  user_id?: number;
  parent_id?: number;
  User?: Partial<User>;
  Replies?: Comment[];
}
