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
  Req,
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
    const params = authorId 
      ? { where: { Post: { some: { author_id: +authorId } } } } 
      : {};
    return this.getSeriesListUseCase.execute(params);
  }

  @Get('mine')
  @ApiOperation({ summary: 'Get current user series' })
  @UseGuards(JwtAuthGuard)
  findMine(@Req() req: any) {
    return this.getSeriesListUseCase.execute({ 
      where: { Post: { some: { author_id: req.user.id } } } 
    });
  }

  @Get('author/:authorId')
  @ApiOperation({ summary: 'Get series by author id' })
  findByAuthor(@Param('authorId') authorId: string) {
    return this.getSeriesListUseCase.execute({ 
      where: { Post: { some: { author_id: +authorId } } } 
    });
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get series by id or slug' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.getSeriesUseCase.execute(idOrSlug);
  }

  // Add more endpoints...
}
