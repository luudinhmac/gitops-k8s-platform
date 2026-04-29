import { Inject, Injectable } from '@nestjs/common';
import { ISeriesRepository, I_SERIES_REPOSITORY } from '../../domain/repositories/series.repository.interface';
import { CreateSeriesDto } from '@portfolio/types';
import { SeriesEntity } from '../../domain/entities/series.entity';

@Injectable()
export class CreateSeriesUseCase {
  constructor(
    @Inject(I_SERIES_REPOSITORY)
    private readonly seriesRepository: ISeriesRepository,
  ) {}

  async execute(data: CreateSeriesDto): Promise<SeriesEntity> {
    return this.seriesRepository.create(data);
  }
}
