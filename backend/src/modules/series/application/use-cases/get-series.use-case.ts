import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISeriesRepository, I_SERIES_REPOSITORY } from '../../domain/repositories/series.repository.interface';
import { Series } from '@portfolio/types';

@Injectable()
export class GetSeriesUseCase {
  constructor(
    @Inject(I_SERIES_REPOSITORY)
    private readonly seriesRepository: ISeriesRepository,
  ) {
    console.log('--- GetSeriesUseCase INITIALIZED (NO CACHE) ---');
  }

  async execute(idOrSlug: string | number): Promise<Series> {
    const isId = !isNaN(Number(idOrSlug));
    const series = isId 
      ? await this.seriesRepository.findById(Number(idOrSlug))
      : await this.seriesRepository.findBySlug(String(idOrSlug));

    if (!series) throw new NotFoundException('Series not found');
    return series;
  }
}
