import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.series.findMany({
      include: {
        _count: {
          select: { Post: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findOne(idOrSlug: string) {
    const id = parseInt(idOrSlug);
    const series = await this.prisma.series.findUnique({
      where: isNaN(id) ? { slug: idOrSlug } : { id },
      include: {
        Post: {
          where: { is_published: true },
          orderBy: { series_order: 'asc' },
          include: {
            Category: true,
            User: { select: { fullname: true } }
          }
        }
      }
    });

    if (!series) throw new NotFoundException('Series not found');
    return series;
  }

  async create(data: { name: string; description?: string }) {
    let slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    let finalSlug = slug;
    let count = 0;
    while (true) {
      const existing = await this.prisma.series.findUnique({ where: { slug: finalSlug } });
      if (!existing) break;
      count++;
      finalSlug = `${slug}-${count}`;
    }

    return this.prisma.series.create({
      data: { ...data, slug: finalSlug }
    });
  }

  async update(id: number, data: { name?: string; description?: string }) {
    let updateData: any = { ...data };
    
    if (data.name) {
      let slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
      let finalSlug = slug;
      let count = 0;
      while (true) {
        const existing = await this.prisma.series.findFirst({ 
          where: { slug: finalSlug, NOT: { id } } 
        });
        if (!existing) break;
        count++;
        finalSlug = `${slug}-${count}`;
      }
      updateData.slug = finalSlug;
    }

    return this.prisma.series.update({
      where: { id },
      data: updateData
    });
  }

  async remove(id: number) {
    // When deleting series, posts are automatically set null via Prisma relation (if configured)
    // or we can manually handle it if needed. Prisma @relation(fields, references) handles it.
    return this.prisma.series.delete({ where: { id } });
  }
}
