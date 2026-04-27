import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ISeriesRepository } from '../../domain/repositories/series.repository.interface';
import { SeriesEntity } from '../../domain/entities/series.entity';
import { SeriesMapper } from '../mappers/series.mapper';
import { CreateSeriesDto, UpdateSeriesDto } from '@portfolio/types';

@Injectable()
export class PrismaSeriesRepository implements ISeriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: any): Promise<SeriesEntity[]> {
    const series = await this.prisma.series.findMany({
      ...params,
      include: {
        _count: {
          select: { Post: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return series.map(s => SeriesMapper.toDomain(s) as SeriesEntity);
  }

  async findById(id: number): Promise<SeriesEntity | null> {
    const series = await this.prisma.series.findUnique({
      where: { id },
      include: {
        Post: {
          select: {
            id: true,
            title: true,
            slug: true,
            created_at: true,
          }
        },
        _count: {
          select: { Post: true }
        }
      }
    });
    return SeriesMapper.toDomain(series);
  }

  async findBySlug(slug: string): Promise<SeriesEntity | null> {
    const series = await this.prisma.series.findUnique({
      where: { slug },
      include: {
        Post: {
          select: {
            id: true,
            title: true,
            slug: true,
            created_at: true,
          }
        },
        _count: {
          select: { Post: true }
        }
      }
    });
    return SeriesMapper.toDomain(series);
  }

  async create(data: CreateSeriesDto): Promise<SeriesEntity> {
    const series = await this.prisma.series.create({ data: data as any });
    return SeriesMapper.toDomain(series) as SeriesEntity;
  }

  async update(id: number, data: UpdateSeriesDto): Promise<SeriesEntity> {
    const series = await this.prisma.series.update({
      where: { id },
      data: data as any,
    });
    return SeriesMapper.toDomain(series) as SeriesEntity;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.series.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.series.count({ where });
  }
}
