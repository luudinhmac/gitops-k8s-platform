import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import slugify from 'slugify';
import { CreateCategoryDto, UpdateCategoryDto } from '@portfolio/contracts';
import { AdminAlertService } from '../admin-alert/admin-alert.service';
import { ICategoriesRepository, I_CATEGORIES_REPOSITORY } from './repositories/category.repository.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(I_CATEGORIES_REPOSITORY) private repository: ICategoriesRepository,
    private adminAlertService: AdminAlertService,
  ) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const category = await this.repository.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(data: CreateCategoryDto) {
    const slug = slugify(data.name || 'category', { lower: true, strict: true, locale: 'vi' });
    let finalSlug = slug;
    let count = 0;
    while (true) {
      const existing = await this.repository.findBySlug(finalSlug);
      if (!existing) break;
      count++;
      finalSlug = `${slug}-${count}`;
    }
    const category = await this.repository.create({ ...data, slug: finalSlug });

    this.adminAlertService.sendAlert({
      subject: `📂 Danh mục mới: ${category.name}`,
      text: `📂 <b>Danh mục mới đã được tạo</b>\n\n` +
            `• <b>Tên:</b> ${category.name}\n` +
            `• <b>Slug:</b> ${category.slug}\n` +
            `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
    });

    return category;
  }

  async update(id: number, data: UpdateCategoryDto) {
    const category = await this.repository.findById(id);
    if (!category) throw new NotFoundException('Category not found');

    let finalSlug = category.slug;
    if (data.name) {
      const slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
      finalSlug = slug;
      let count = 0;
      while (true) {
        const existing = await this.repository.findBySlug(finalSlug);
        if (!existing || existing.id === id) break;
        count++;
        finalSlug = `${slug}-${count}`;
      }
    }

    return this.repository.update(id, { ...data, slug: finalSlug });
  }

  async remove(id: number) {
    await this.repository.delete(id);
    return { success: true };
  }
}
