import { PostEntity } from '../../domain/entities/post.entity';
import { Prisma } from '@prisma/client';

export class PostMapper {
  static toDomain(raw: any): PostEntity | null {
    if (!raw) return null;
    return new PostEntity({
      id: raw.id,
      title: raw.title,
      slug: raw.slug,
      excerpt: raw.excerpt,
      content: raw.content,
      series_id: raw.series_id,
      series_order: raw.series_order,
      cover_image: raw.cover_image,
      is_pinned: raw.is_pinned,
      is_published: raw.is_published,
      views: raw.views,
      likes: raw.likes,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      is_blocked: raw.is_blocked,
      blocked_by_id: raw.blocked_by_id,
      blocked_reason: raw.blocked_reason,
      category_id: raw.category_id,
      author_id: raw.author_id,
      Author: raw.Author,
      Category: raw.Category,
      Series: raw.Series,
      Comment: raw.Comment,
      Tag: raw.Tag,
      _count: raw._count,
    });
  }

  static toPersistence(entity: PostEntity): any {
    return {
      title: entity.title,
      slug: entity.slug,
      content: entity.content,
      series_id: entity.series_id,
      series_order: entity.series_order,
      cover_image: entity.cover_image,
      is_pinned: entity.is_pinned,
      is_published: entity.is_published,
      category_id: entity.category_id,
      author_id: entity.author_id,
      is_blocked: entity.is_blocked,
      blocked_by_id: entity.blocked_by_id,
      blocked_reason: entity.blocked_reason,
    };
  }
}
