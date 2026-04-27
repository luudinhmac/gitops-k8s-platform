import { CommentEntity } from '../../domain/entities/comment.entity';

export class CommentMapper {
  static toDomain(raw: any): CommentEntity | null {
    if (!raw) return null;
    return new CommentEntity({
      id: raw.id,
      post_id: raw.post_id,
      user_id: raw.user_id,
      parent_id: raw.parent_id,
      content: raw.content,
      author_name: raw.author_name,
      author_email: raw.author_email,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      User: raw.User ? {
        id: raw.User.id,
        username: raw.User.username,
        fullname: raw.User.fullname,
        avatar: raw.User.avatar,
      } : undefined,
    });
  }
}
