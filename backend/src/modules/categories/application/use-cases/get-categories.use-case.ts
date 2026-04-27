import { Inject, Injectable } from '@nestjs/common';
import { ICategoriesRepository, I_CATEGORIES_REPOSITORY } from '../../domain/repositories/category.repository.interface';
import { Category } from '@portfolio/types';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class GetCategoriesUseCase {
  constructor(
    @Inject(I_CATEGORIES_REPOSITORY)
    private readonly categoryRepository: ICategoriesRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(): Promise<Category[]> {
    const cacheKey = 'categories_list';
    const cachedData = await this.cacheManager.get<Category[]>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const categories = await this.categoryRepository.findAll();
    await this.cacheManager.set(cacheKey, categories, 600000); // 10 minutes
    
    return categories;
  }
}
