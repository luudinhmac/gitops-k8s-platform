import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { PrismaModule } from '../../prisma/prisma.module';
<<<<<<< HEAD

@Module({
  imports: [PrismaModule],
  providers: [SeriesService],
  controllers: [SeriesController],
  exports: [SeriesService],
=======
import { SeriesRepository } from './repositories/series.repository';
import { I_SERIES_REPOSITORY } from './repositories/series.repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [SeriesController],
  providers: [
    SeriesService,
    {
      provide: I_SERIES_REPOSITORY,
      useClass: SeriesRepository,
    },
  ],
  exports: [SeriesService, I_SERIES_REPOSITORY],
>>>>>>> feature/arch-refactor
})
export class SeriesModule {}
