import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateSeriesDto, UpdateSeriesDto } from '@portfolio/types';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// Use Cases
import { GetSeriesListUseCase } from '../../application/use-cases/get-series-list.use-case';
import { GetSeriesUseCase } from '../../application/use-cases/get-series.use-case';

@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(
    private readonly getSeriesListUseCase: GetSeriesListUseCase,
    private readonly getSeriesUseCase: GetSeriesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all series' })
  findAll(@Query('author_id') authorId?: string) {
    const params = authorId ? { where: { author_id: +authorId } } : {};
    return this.getSeriesListUseCase.execute(params);
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get series by id or slug' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.getSeriesUseCase.execute(idOrSlug);
  }

  // Add more endpoints...
}
