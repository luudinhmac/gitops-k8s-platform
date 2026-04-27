import { Module } from '@nestjs/common';
import { SeriesController } from './controllers/series.controller';
import { PrismaSeriesRepository } from '../infrastructure/repositories/prisma-series.repository';
import { I_SERIES_REPOSITORY } from '../domain/repositories/series.repository.interface';

// Use Cases
import { GetSeriesListUseCase } from '../application/use-cases/get-series-list.use-case';
import { GetSeriesUseCase } from '../application/use-cases/get-series.use-case';

@Module({
  controllers: [SeriesController],
  providers: [
    {
      provide: I_SERIES_REPOSITORY,
      useClass: PrismaSeriesRepository,
    },
    GetSeriesListUseCase,
    GetSeriesUseCase,
  ],
  exports: [I_SERIES_REPOSITORY],
})
export class SeriesModule {}
