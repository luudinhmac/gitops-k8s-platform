import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICategoriesRepository } from '../../domain/repositories/category.repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryMapper } from '../mappers/category.mapper';
import { CreateCategoryDto, UpdateCategoryDto } from '@portfolio/types';

@Injectable()
export class PrismaCategoryRepository implements ICategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { Post: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return categories.map(cat => CategoryMapper.toDomain(cat) as CategoryEntity);
  }

  async findById(id: number): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({ 
      where: { id },
      include: {
        _count: {
          select: { Post: true }
        }
      }
    });
    return CategoryMapper.toDomain(category);
  }

  async findBySlug(slug: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({ 
      where: { slug },
      include: {
        _count: {
          select: { Post: true }
        }
      }
    });
    return CategoryMapper.toDomain(category);
  }

  async create(data: CreateCategoryDto): Promise<CategoryEntity> {
    const category = await this.prisma.category.create({ data: data as any });
    return CategoryMapper.toDomain(category) as CategoryEntity;
  }

  async update(id: number, data: UpdateCategoryDto): Promise<CategoryEntity> {
    const category = await this.prisma.category.update({
      where: { id },
      data: data as any,
    });
    return CategoryMapper.toDomain(category) as CategoryEntity;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
