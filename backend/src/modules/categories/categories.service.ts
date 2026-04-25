import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import slugify from 'slugify';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { AdminAlertService } from '../../admin-alert/admin-alert.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private adminAlertService: AdminAlertService,
  ) {}

  async findAll() {
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
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(data: CreateCategoryDto) {
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
      if (!existing) break;
      count++;
      finalSlug = `${slug}-${count}`;
    }
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
    });

    return category;
  }

  async update(id: number, data: UpdateCategoryDto) {
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
  }
}
