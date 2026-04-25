export class CreateCommentDto {
  post_id: number;
  user_id?: number;
  parent_id?: number;
  author_name: string;
  author_email?: string;
  content: string;
}
