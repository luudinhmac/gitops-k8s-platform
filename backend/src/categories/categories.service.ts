import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { Post: true }
        }
      }
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(data: { name: string }) {
    let slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    let finalSlug = slug;
    let count = 0;
    while (true) {
      const existing = await this.prisma.category.findUnique({ where: { slug: finalSlug } });
      if (!existing) break;
      count++;
      finalSlug = `${slug}-${count}`;
    }
    return this.prisma.category.create({ 
      data: { ...data, slug: finalSlug } 
    });
  }

  async update(id: number, data: { name: string }) {
    let slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    let finalSlug = slug;
    let count = 0;
    while (true) {
      const existing = await this.prisma.category.findFirst({ 
        where: { slug: finalSlug, NOT: { id } } 
      });
      if (!existing) break;
      count++;
      finalSlug = `${slug}-${count}`;
    }
    return this.prisma.category.update({
      where: { id },
      data: { ...data, slug: finalSlug }
    });
  }

  async remove(id: number) {
    // Để an toàn dữ liệu, bài viết sẽ được chuyển về null category nếu danh mục bị xóa
    // (Thực tế Prisma sẽ tự xử lý nếu Relation là set null, hoặc cần dọn trước)
    return this.prisma.category.delete({ where: { id } });
  }
}
