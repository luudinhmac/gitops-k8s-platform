import { PostEntity } from '../domain/post.entity';

export class PostMapper {
  static toDomain(raw: any): PostEntity | null {
    if (!raw) return null;

    const isPublished = raw.status === 'PUBLISHED';
    const isBlocked = raw.status === 'BLOCKED';

    const entity = new PostEntity({
      id: raw.id,
      title: raw.title,
      slug: raw.slug,
      excerpt: raw.excerpt,
      focus_keyword: raw.focus_keyword,
      content: raw.content,
      series_id: raw.series_id,
      series_order: raw.series_order,
      cover_image: raw.cover_image,
      is_pinned: raw.is_pinned,
      is_published: isPublished,
      views: raw.views,
      likes: raw.likes || 0,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      is_blocked: isBlocked,
      blocked_by_id: raw.blocked_by_id,
      blocked_reason: raw.blocked_reason,
      category_id: raw.category_id,
      author_id: raw.author_id,
      Author: raw.Author ? {
        id: raw.Author.id,
        username: raw.Author.username,
        fullname: raw.Author.Profile?.fullname ?? raw.Author.fullname ?? null,
        avatar: raw.Author.Profile?.avatar ?? raw.Author.avatar ?? null,
      } : undefined,
      BlockedBy: raw.BlockedBy ? {
        id: raw.BlockedBy.id,
        username: raw.BlockedBy.username,
        fullname: raw.BlockedBy.Profile?.fullname ?? raw.BlockedBy.fullname ?? null,
        avatar: raw.BlockedBy.Profile?.avatar ?? raw.BlockedBy.avatar ?? null,
      } : undefined,
      Category: raw.Category,
      Series: raw.Series,
      Comment: raw.Comment,
      Tag: raw.Tag,
    });

    // Map Prisma counts to domain properties
    if (raw._count) {
      if (raw._count.Comment !== undefined) {
        entity.comment_count = raw._count.Comment;
      }
      if (raw._count.PostLike !== undefined) {
        entity.likes = raw._count.PostLike;
      }
    }

    return entity;
  }

  static toPersistence(entity: PostEntity): any {
    return {
      title: entity.title,
      slug: entity.slug,
      content: entity.content,
      excerpt: entity.excerpt,
      focus_keyword: entity.focus_keyword,
      series_id: entity.series_id,
      series_order: entity.series_order,
      cover_image: entity.cover_image,
      is_pinned: entity.is_pinned,
      status: entity.is_blocked ? 'BLOCKED' : (entity.is_published ? 'PUBLISHED' : 'DRAFT'),
      category_id: entity.category_id,
      author_id: entity.author_id,
      blocked_by_id: entity.blocked_by_id,
      blocked_reason: entity.blocked_reason,
    };
  }
}
