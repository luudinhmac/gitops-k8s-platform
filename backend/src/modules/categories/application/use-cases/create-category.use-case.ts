import { Inject, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { ICategoriesRepository, I_CATEGORIES_REPOSITORY } from '../../domain/repositories/category.repository.interface';
import { Category, CreateCategoryDto } from '@portfolio/types';
import { AdminAlertService } from '../../../admin-alert/admin-alert.service';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(I_CATEGORIES_REPOSITORY)
    private readonly categoryRepository: ICategoriesRepository,
    private readonly adminAlertService: AdminAlertService,
  ) {}

  async execute(data: CreateCategoryDto): Promise<Category> {
    const slug = slugify(data.name || 'category', { lower: true, strict: true, locale: 'vi' });
    let finalSlug = slug;
    let count = 0;
    while (true) {
      const existing = await this.categoryRepository.findBySlug(finalSlug);
      if (!existing) break;
      count++;
      finalSlug = `${slug}-${count}`;
    }
    const category = await this.categoryRepository.create({ ...data, slug: finalSlug });

    this.adminAlertService.sendAlert({
      subject: `📂 Danh mục mới: ${category.name}`,
      text: `📂 <b>Danh mục mới đã được tạo</b>\n\n` +
            `• <b>Tên:</b> ${category.name}\n` +
            `• <b>Slug:</b> ${category.slug}\n` +
            `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
    });

    return category;
  }
}
