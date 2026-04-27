import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICategoriesRepository, I_CATEGORIES_REPOSITORY } from '../../domain/repositories/category.repository.interface';
import { Category } from '@portfolio/types';

@Injectable()
export class GetCategoryUseCase {
  constructor(
    @Inject(I_CATEGORIES_REPOSITORY)
    private readonly categoryRepository: ICategoriesRepository,
  ) {}

  async execute(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
