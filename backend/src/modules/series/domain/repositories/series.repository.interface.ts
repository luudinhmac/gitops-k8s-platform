import { SeriesEntity } from '../entities/series.entity';
import { CreateSeriesDto, UpdateSeriesDto } from '@portfolio/types';

export const I_SERIES_REPOSITORY = 'I_SERIES_REPOSITORY';

export interface ISeriesRepository {
  findAll(params?: any): Promise<SeriesEntity[]>;
  findById(id: number): Promise<SeriesEntity | null>;
  findBySlug(slug: string): Promise<SeriesEntity | null>;
  create(data: CreateSeriesDto): Promise<SeriesEntity>;
  update(id: number, data: UpdateSeriesDto): Promise<SeriesEntity>;
  delete(id: number): Promise<void>;
  count(where?: any): Promise<number>;
}
