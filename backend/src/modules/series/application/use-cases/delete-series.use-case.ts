import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISeriesRepository, I_SERIES_REPOSITORY } from '../../domain/repositories/series.repository.interface';

@Injectable()
export class DeleteSeriesUseCase {
  constructor(
    @Inject(I_SERIES_REPOSITORY)
    private readonly seriesRepository: ISeriesRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const series = await this.seriesRepository.findById(id);
    if (!series) {
      throw new NotFoundException('Series not found');
    }

    await this.seriesRepository.delete(id);
  }
}
