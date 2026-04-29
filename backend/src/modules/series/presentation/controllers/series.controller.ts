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
import { CreateSeriesDto, UpdateSeriesDto } from '@portfolio/contracts';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// Use Cases
import { GetSeriesListUseCaseV2 } from '../../application/use-cases/get-series-list.use-case';
import { GetSeriesUseCase } from '../../application/use-cases/get-series.use-case';
import { CreateSeriesUseCase } from '../../application/use-cases/create-series.use-case';
import { UpdateSeriesUseCase } from '../../application/use-cases/update-series.use-case';
import { DeleteSeriesUseCase } from '../../application/use-cases/delete-series.use-case';

@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(
    private readonly getSeriesListUseCase: GetSeriesListUseCaseV2,
    private readonly getSeriesUseCase: GetSeriesUseCase,
    private readonly createSeriesUseCase: CreateSeriesUseCase,
    private readonly updateSeriesUseCase: UpdateSeriesUseCase,
    private readonly deleteSeriesUseCase: DeleteSeriesUseCase,
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
  @ApiBearerAuth()
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

  @Post()
  @ApiOperation({ summary: 'Create new series' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.createSeriesUseCase.execute(createSeriesDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update series' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateSeriesDto: UpdateSeriesDto) {
    return this.updateSeriesUseCase.execute(+id, updateSeriesDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete series' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.deleteSeriesUseCase.execute(+id);
  }
}
