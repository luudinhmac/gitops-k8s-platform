import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISeriesRepository, I_SERIES_REPOSITORY } from '../../domain/repositories/series.repository.interface';
import { Series } from '@portfolio/types';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class GetSeriesUseCase {
  constructor(
    @Inject(I_SERIES_REPOSITORY)
    private readonly seriesRepository: ISeriesRepository,
    // @Inject(CACHE_MANAGER)
    // private readonly cacheManager: Cache,
  ) {}

  async execute(idOrSlug: string | number): Promise<Series> {
    const cacheKey = `series_detail_${idOrSlug}`;
    // const cached = await this.cacheManager.get<Series>(cacheKey);
    // if (cached) return cached;

    const isId = !isNaN(Number(idOrSlug));
    const series = isId 
      ? await this.seriesRepository.findById(Number(idOrSlug))
      : await this.seriesRepository.findBySlug(String(idOrSlug));

    if (!series) throw new NotFoundException('Series not found');
    
    // await this.cacheManager.set(cacheKey, series, 600000); // 10 minutes
    return series;
  }
}
