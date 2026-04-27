import { Inject, Injectable } from '@nestjs/common';
import { ICategoriesRepository, I_CATEGORIES_REPOSITORY } from '../../domain/repositories/category.repository.interface';
import { Category } from '@portfolio/types';

@Injectable()
export class GetCategoriesUseCase {
  constructor(
    @Inject(I_CATEGORIES_REPOSITORY)
    private readonly categoryRepository: ICategoriesRepository,
  ) {
    console.log('--- GetCategoriesUseCase INITIALIZED (NO CACHE) ---');
  }

  async execute(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }
}
