import { CategoryEntity } from '../../domain/entities/category.entity';

export class CategoryMapper {
  static toDomain(raw: any): CategoryEntity | null {
    if (!raw) return null;
    return new CategoryEntity({
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      description: raw.description,
      _count: raw._count,
    });
  }
}
