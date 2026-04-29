import { Module } from '@nestjs/common';
import { SeriesController } from './controllers/series.controller';
import { PrismaSeriesRepository } from '../infrastructure/repositories/prisma-series.repository';
import { I_SERIES_REPOSITORY } from '../domain/repositories/series.repository.interface';

// Use Cases
import { GetSeriesListUseCaseV2 as GetSeriesListUseCase } from '../application/use-cases/get-series-list.use-case';
import { GetSeriesUseCase } from '../application/use-cases/get-series.use-case';
import { CreateSeriesUseCase } from '../application/use-cases/create-series.use-case';
import { UpdateSeriesUseCase } from '../application/use-cases/update-series.use-case';
import { DeleteSeriesUseCase } from '../application/use-cases/delete-series.use-case';


@Module({
  imports: [],
  controllers: [SeriesController],
  providers: [
    {
      provide: I_SERIES_REPOSITORY,
      useClass: PrismaSeriesRepository,
    },
    GetSeriesListUseCase,
    GetSeriesUseCase,
    CreateSeriesUseCase,
    UpdateSeriesUseCase,
    DeleteSeriesUseCase,
  ],
  exports: [I_SERIES_REPOSITORY],
})
export class SeriesModule {}
