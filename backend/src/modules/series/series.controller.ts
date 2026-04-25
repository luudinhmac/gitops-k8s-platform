import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateSeriesDto, UpdateSeriesDto } from './dto/series.dto';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  findAll() {
    return this.seriesService.findAll();
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.seriesService.findOne(idOrSlug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'editor')
  create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'editor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeriesDto: UpdateSeriesDto,
  ) {
    return this.seriesService.update(id, updateSeriesDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'editor')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.seriesService.remove(id);
  }
}
