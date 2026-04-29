import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISeriesRepository, I_SERIES_REPOSITORY } from '../../domain/repositories/series.repository.interface';
import { UpdateSeriesDto } from '@portfolio/types';
import { SeriesEntity } from '../../domain/entities/series.entity';

@Injectable()
export class UpdateSeriesUseCase {
  constructor(
    @Inject(I_SERIES_REPOSITORY)
    private readonly seriesRepository: ISeriesRepository,
  ) {}

  async execute(id: number, data: UpdateSeriesDto): Promise<SeriesEntity> {
    const series = await this.seriesRepository.findById(id);
    if (!series) {
      throw new NotFoundException('Series not found');
    }

    return this.seriesRepository.update(id, data);
  }
}
