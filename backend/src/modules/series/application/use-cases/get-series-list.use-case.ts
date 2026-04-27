import { Inject, Injectable } from '@nestjs/common';
import { ISeriesRepository, I_SERIES_REPOSITORY } from '../../domain/repositories/series.repository.interface';
import { Series } from '@portfolio/types';

@Injectable()
export class GetSeriesListUseCaseV2 {
  constructor(
    @Inject(I_SERIES_REPOSITORY)
    private readonly seriesRepository: ISeriesRepository,
  ) {
    console.log('--- GetSeriesListUseCaseV2 INITIALIZED ---');
  }

  async execute(params?: any): Promise<Series[]> {
    return await this.seriesRepository.findAll(params);
  }
}
