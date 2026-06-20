import { CategoryEntity } from '../../domain/entities/category.entity';

export class CategoryMapper {
  static toDomain(raw: any): CategoryEntity | null {
    if (!raw) return null;
    return new CategoryEntity({
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      description: raw.description,
      parent_id: raw.parent_id ?? undefined,
      Parent: raw.Parent ? (CategoryMapper.toDomain(raw.Parent) as CategoryEntity) : undefined,
      Children: raw.Children
        ? raw.Children.map((child: any) => CategoryMapper.toDomain(child) as CategoryEntity).filter(Boolean)
        : undefined,
      _count: raw._count,
    });
  }
}
