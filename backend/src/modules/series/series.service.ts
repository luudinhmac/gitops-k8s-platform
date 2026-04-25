import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import slugify from 'slugify';
import { CreateSeriesDto, UpdateSeriesDto } from './dto/series.dto';

@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.series.findMany({
      include: {
        _count: {
          select: { Post: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(idOrSlug: string | number) {
    const isId = !isNaN(Number(idOrSlug));
    const where = isId ? { id: Number(idOrSlug) } : { slug: String(idOrSlug) };

    const series = await this.prisma.series.findUnique({
      where,
      include: {
        Post: {
          where: { is_published: true },
          orderBy: { series_order: 'asc' },
          include: {
            Category: true,
            User: { select: { fullname: true } },
          },
        },
      },
    });

    if (!series) throw new NotFoundException('Series not found');
    return series;
  }

  async create(data: CreateSeriesDto) {
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
    let finalSlug = slug;
    let count = 0;
    while (true) {
      const existing = await this.prisma.series.findUnique({
        where: { slug: finalSlug },
      });
      if (!existing) break;
      count++;
      finalSlug = `${slug}-${count}`;
    }

    return this.prisma.series.create({
      data: { ...data, slug: finalSlug },
    });
  }

  async update(id: number, data: UpdateSeriesDto) {
    let finalSlug: string | undefined;

    if (data.name) {
      const slug = slugify(data.name, {
        lower: true,
        strict: true,
        locale: 'vi',
      });
      finalSlug = slug;
      let count = 0;
      while (true) {
        const existing = await this.prisma.series.findFirst({
          where: { slug: finalSlug, NOT: { id } },
        });
        if (!existing) break;
        count++;
        finalSlug = `${slug}-${count}`;
      }
    }

    const updateData = {
      ...data,
      ...(finalSlug ? { slug: finalSlug } : {}),
    };

    return this.prisma.series.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.series.delete({ where: { id } });
  }
}
