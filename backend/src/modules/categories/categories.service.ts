<<<<<<< HEAD
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import slugify from 'slugify';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { AdminAlertService } from '../../admin-alert/admin-alert.service';
=======
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import slugify from 'slugify';
import { CreateCategoryDto, UpdateCategoryDto } from '@portfolio/contracts';
import { AdminAlertService } from '../admin-alert/admin-alert.service';
import { ICategoriesRepository, I_CATEGORIES_REPOSITORY } from './repositories/category.repository.interface';
>>>>>>> feature/arch-refactor

@Injectable()
export class CategoriesService {
  constructor(
<<<<<<< HEAD
    private prisma: PrismaService,
=======
    @Inject(I_CATEGORIES_REPOSITORY) private repository: ICategoriesRepository,
>>>>>>> feature/arch-refactor
    private adminAlertService: AdminAlertService,
  ) {}

  async findAll() {
<<<<<<< HEAD
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { Post: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
=======
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const category = await this.repository.findById(id);
>>>>>>> feature/arch-refactor
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(data: CreateCategoryDto) {
<<<<<<< HEAD
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
    let finalSlug = slug;
    let count = 0;
    while (true) {
      const existing = await this.prisma.category.findUnique({
        where: { slug: finalSlug },
      });
=======
    const slug = slugify(data.name || 'category', { lower: true, strict: true, locale: 'vi' });
    let finalSlug = slug;
    let count = 0;
    while (true) {
      const existing = await this.repository.findBySlug(finalSlug);
>>>>>>> feature/arch-refactor
      if (!existing) break;
      count++;
      finalSlug = `${slug}-${count}`;
    }
<<<<<<< HEAD
    const category = await this.prisma.category.create({
      data: { ...data, slug: finalSlug },
    });

    // Notify info
    this.adminAlertService.sendAlert({
      subject: `📂 Danh mục mới: ${category.name}`,
      text: `📂 <b>Danh mục mới đã được tạo</b>\n\n` +
            `• <b>Tên:</b> ${category.name}\n` +
            `• <b>Slug:</b> ${category.slug}\n` +
            `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
=======
    const category = await this.repository.create({ ...data, slug: finalSlug });

    this.adminAlertService.sendAlert({
      subject: `📂 Danh mục mới: ${category.name}`,
      text: `📂 <b>Danh mục mới đã được tạo</b>\n\n• <b>Tên:</b> ${category.name}\n• <b>Slug:</b> ${category.slug}`,
>>>>>>> feature/arch-refactor
    });

    return category;
  }

  async update(id: number, data: UpdateCategoryDto) {
<<<<<<< HEAD
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
    let finalSlug = slug;
    let count = 0;
    while (true) {
      const existing = await this.prisma.category.findFirst({
        where: { slug: finalSlug, NOT: { id } },
      });
      if (!existing) break;
      count++;
      finalSlug = `${slug}-${count}`;
    }
    return this.prisma.category.update({
      where: { id },
      data: { ...data, slug: finalSlug },
    });
  }

  async remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
=======
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
>>>>>>> feature/arch-refactor
  }
}
