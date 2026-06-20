import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import slugify from 'slugify';
import {
  ICategoriesRepository,
  I_CATEGORIES_REPOSITORY,
} from '../../domain/repositories/category.repository.interface';
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

    if (data.parent_id !== undefined && data.parent_id !== null) {
      if (data.parent_id === id) {
        throw new BadRequestException('Danh mục không thể làm cha của chính nó');
      }
      const parent = await this.categoryRepository.findById(data.parent_id);
      if (!parent) {
        throw new NotFoundException('Danh mục cha không tồn tại');
      }
      if (parent.parent_id) {
        throw new BadRequestException(
          'Danh mục cha không thể là danh mục con của danh mục khác (Chỉ hỗ trợ tối đa 2 cấp danh mục)',
        );
      }
      if (category.Children && category.Children.length > 0) {
        throw new BadRequestException(
          'Danh mục này đang có danh mục con, không thể chuyển thành danh mục con của danh mục khác',
        );
      }
    }

    let finalSlug = category.slug;
    if (data.name) {
      const slug = slugify(data.name, {
        lower: true,
        strict: true,
        locale: 'vi',
      });
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
