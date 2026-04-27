import { Inject, Injectable } from '@nestjs/common';
import { ISeriesRepository, I_SERIES_REPOSITORY } from '../../domain/repositories/series.repository.interface';
import { Series } from '@portfolio/types';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class GetSeriesListUseCase {
  constructor(
    @Inject(I_SERIES_REPOSITORY)
    private readonly seriesRepository: ISeriesRepository,
    // @Inject(CACHE_MANAGER)
    // private readonly cacheManager: Cache,
  ) {}

  async execute(params?: any): Promise<Series[]> {
    const cacheKey = `series_list_${JSON.stringify(params || {})}`;
    // const cached = await this.cacheManager.get<Series[]>(cacheKey);
    // if (cached) return cached;

    const series = await this.seriesRepository.findAll(params);
    // await this.cacheManager.set(cacheKey, series, 600000); // 10 minutes
    return series;
  }
}
