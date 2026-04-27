import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { ICategoriesRepository, I_CATEGORIES_REPOSITORY } from '../../domain/repositories/category.repository.interface';
import { Category, UpdateCategoryDto } from '@portfolio/types';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(I_CATEGORIES_REPOSITORY)
    private readonly categoryRepository: ICategoriesRepository,
  ) {}

  async execute(id: number, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');

    let finalSlug = category.slug;
    if (data.name) {
      const slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
      finalSlug = slug;
      let count = 0;
      while (true) {
        const existing = await this.categoryRepository.findBySlug(finalSlug);
        if (!existing || existing.id === id) break;
        count++;
        finalSlug = `${slug}-${count}`;
      }
    }

    return this.categoryRepository.update(id, { ...data, slug: finalSlug });
  }
}
