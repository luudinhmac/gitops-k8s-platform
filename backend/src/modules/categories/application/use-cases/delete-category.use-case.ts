import { Inject, Injectable } from '@nestjs/common';
import { ICategoriesRepository, I_CATEGORIES_REPOSITORY } from '../../domain/repositories/category.repository.interface';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(I_CATEGORIES_REPOSITORY)
    private readonly categoryRepository: ICategoriesRepository,
  ) {}

  async execute(id: number): Promise<{ success: boolean }> {
    await this.categoryRepository.delete(id);
    return { success: true };
  }
}
