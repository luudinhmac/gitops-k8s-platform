import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ISeriesRepository } from './series.repository.interface';
import { SeriesEntity } from '../domain/series.entity';
import { CreateSeriesDto, UpdateSeriesDto } from '@portfolio/contracts';

@Injectable()
export class SeriesRepository implements ISeriesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<SeriesEntity[]> {
    return this.prisma.series.findMany({
      include: { 
        _count: {
          select: { Post: true }
        } 
      },
      orderBy: { created_at: 'desc' },
    }) as any;
  }

  async findById(id: number): Promise<SeriesEntity | null> {
    return this.prisma.series.findUnique({ where: { id } }) as any;
  }

  async findBySlug(slug: string): Promise<SeriesEntity | null> {
    return this.prisma.series.findUnique({
      where: { slug },
      include: {
        Post: {
          where: { is_published: true },
          include: { Category: true },
          orderBy: { series_order: 'asc' },
        }
      }
    }) as any;
  }

  async findByAuthor(authorId: number): Promise<SeriesEntity[]> {
    return this.prisma.series.findMany({
      where: {
        Post: {
          some: { author_id: authorId }
        }
      },
      include: {
        _count: {
          select: { Post: true }
        }
      },
      orderBy: { created_at: 'desc' }
    }) as any;
  }

  async create(data: CreateSeriesDto): Promise<SeriesEntity> {
    return this.prisma.series.create({ data: data as any }) as any;
  }

  async update(id: number, data: UpdateSeriesDto): Promise<SeriesEntity> {
    return this.prisma.series.update({ where: { id }, data: data as any }) as any;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.series.delete({ where: { id } });
  }
}
