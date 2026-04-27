import { CategoryEntity } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '@portfolio/types';

export const I_CATEGORIES_REPOSITORY = 'I_CATEGORIES_REPOSITORY';

export interface ICategoriesRepository {
  findAll(): Promise<CategoryEntity[]>;
  findById(id: number): Promise<CategoryEntity | null>;
  findBySlug(slug: string): Promise<CategoryEntity | null>;
  create(data: CreateCategoryDto): Promise<CategoryEntity>;
  update(id: number, data: UpdateCategoryDto): Promise<CategoryEntity>;
  delete(id: number): Promise<void>;
}
