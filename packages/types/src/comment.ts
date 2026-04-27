export interface Comment {
  id: number;
  post_id: number;
  user_id?: number | null;
  parent_id?: number | null;
  content: string;
  author_name?: string | null;
  author_email?: string | null;
  created_at: Date;
  updated_at?: Date;
  User?: {
    id: number;
    username: string;
    fullname?: string | null;
    avatar?: string | null;
  };
  Replies?: Comment[];
}

export interface CreateCommentDto {
  post_id: number;
  content: string;
  parent_id?: number | null;
  user_id?: number | null;
  author_name?: string | null;
  author_email?: string | null;
}

export interface UpdateCommentDto {
  content: string;
}
