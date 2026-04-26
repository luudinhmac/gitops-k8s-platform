<<<<<<< HEAD
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
=======
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import slugify from 'slugify';
import { CreateSeriesDto, UpdateSeriesDto } from '@portfolio/contracts';
import { ISeriesRepository, I_SERIES_REPOSITORY } from './repositories/series.repository.interface';

@Injectable()
export class SeriesService {
  constructor(
    @Inject(I_SERIES_REPOSITORY) private repository: ISeriesRepository,
  ) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findByAuthor(authorId: number) {
    return this.repository.findByAuthor(authorId);
>>>>>>> feature/arch-refactor
  }

  async findOne(idOrSlug: string | number) {
    const isId = !isNaN(Number(idOrSlug));
<<<<<<< HEAD
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
=======
    const series = isId 
      ? await this.repository.findById(Number(idOrSlug))
      : await this.repository.findBySlug(String(idOrSlug));
>>>>>>> feature/arch-refactor

    if (!series) throw new NotFoundException('Series not found');
    return series;
  }

  async create(data: CreateSeriesDto) {
<<<<<<< HEAD
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
=======
    const slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
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
    return this.prisma.series.create({
      data: { ...data, slug: finalSlug },
    });
=======
    return this.repository.create({ ...data, slug: finalSlug });
>>>>>>> feature/arch-refactor
  }

  async update(id: number, data: UpdateSeriesDto) {
    let finalSlug: string | undefined;

    if (data.name) {
<<<<<<< HEAD
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
=======
      const slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
      finalSlug = slug;
      let count = 0;
      while (true) {
        const existing = await this.repository.findBySlug(finalSlug);
        if (!existing || existing.id === id) break;
>>>>>>> feature/arch-refactor
        count++;
        finalSlug = `${slug}-${count}`;
      }
    }

<<<<<<< HEAD
    const updateData = {
      ...data,
      ...(finalSlug ? { slug: finalSlug } : {}),
    };

    return this.prisma.series.update({
      where: { id },
      data: updateData,
=======
    return this.repository.update(id, {
      ...data,
      ...(finalSlug ? { slug: finalSlug } : {}),
>>>>>>> feature/arch-refactor
    });
  }

  async remove(id: number) {
<<<<<<< HEAD
    return this.prisma.series.delete({ where: { id } });
=======
    await this.repository.delete(id);
    return { success: true };
>>>>>>> feature/arch-refactor
  }
}
