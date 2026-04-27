import { Inject, Injectable } from '@nestjs/common';
import { ISeriesRepository, I_SERIES_REPOSITORY } from '../../domain/repositories/series.repository.interface';
import { Series } from '@portfolio/types';

@Injectable()
export class GetSeriesListUseCase {
  constructor(
    @Inject(I_SERIES_REPOSITORY)
    private readonly seriesRepository: ISeriesRepository,
  ) {
    console.log('--- GetSeriesListUseCase INITIALIZED (NO CACHE) ---');
  }

  async execute(params?: any): Promise<Series[]> {
    return await this.seriesRepository.findAll(params);
  }
}
