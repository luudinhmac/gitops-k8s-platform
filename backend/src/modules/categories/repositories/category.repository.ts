import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ICategoriesRepository } from './category.repository.interface';
import { CategoryEntity } from '../domain/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '@portfolio/contracts';

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({
      include: { 
        _count: { 
          select: { 
            Post: {
              where: { is_published: true }
            } 
          } 
        } 
      },
    }) as any;
  }

  async findById(id: number): Promise<CategoryEntity | null> {
    return this.prisma.category.findUnique({ where: { id } }) as any;
  }

  async findBySlug(slug: string): Promise<CategoryEntity | null> {
    return this.prisma.category.findUnique({ where: { slug } }) as any;
  }

  async create(data: CreateCategoryDto): Promise<CategoryEntity> {
    return this.prisma.category.create({ data: data as any }) as any;
  }

  async update(id: number, data: UpdateCategoryDto): Promise<CategoryEntity> {
    return this.prisma.category.update({ where: { id }, data: data as any }) as any;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
