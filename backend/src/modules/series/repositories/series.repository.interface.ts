import { SeriesEntity } from '../domain/series.entity';
import { CreateSeriesDto, UpdateSeriesDto } from '@portfolio/contracts';

export const I_SERIES_REPOSITORY = 'I_SERIES_REPOSITORY';

export interface ISeriesRepository {
  findAll(): Promise<SeriesEntity[]>;
  findById(id: number): Promise<SeriesEntity | null>;
  findBySlug(slug: string): Promise<SeriesEntity | null>;
  findByAuthor(authorId: number): Promise<SeriesEntity[]>;
  create(data: CreateSeriesDto): Promise<SeriesEntity>;
  update(id: number, data: UpdateSeriesDto): Promise<SeriesEntity>;
  delete(id: number): Promise<void>;
}
