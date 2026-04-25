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
  }

  async findOne(idOrSlug: string | number) {
    const isId = !isNaN(Number(idOrSlug));
    const series = isId 
      ? await this.repository.findById(Number(idOrSlug))
      : await this.repository.findBySlug(String(idOrSlug));

    if (!series) throw new NotFoundException('Series not found');
    return series;
  }

  async create(data: CreateSeriesDto) {
    const slug = slugify(data.name, { lower: true, strict: true, locale: 'vi' });
    let finalSlug = slug;
    let count = 0;
    while (true) {
      const existing = await this.repository.findBySlug(finalSlug);
      if (!existing) break;
      count++;
      finalSlug = `${slug}-${count}`;
    }

    return this.repository.create({ ...data, slug: finalSlug });
  }

  async update(id: number, data: UpdateSeriesDto) {
    let finalSlug: string | undefined;

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

    return this.repository.update(id, {
      ...data,
      ...(finalSlug ? { slug: finalSlug } : {}),
    });
  }

  async remove(id: number) {
    await this.repository.delete(id);
    return { success: true };
  }
}
