import { SeriesEntity } from '../../domain/entities/series.entity';

export class SeriesMapper {
  static toDomain(raw: any): SeriesEntity | null {
    if (!raw) return null;
    return new SeriesEntity({
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      description: raw.description,
      _count: raw._count,
      Post: raw.Post ? raw.Post.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        created_at: p.created_at,
      })) : undefined,
    });
  }
}
