import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Patch, ForbiddenException } from '@nestjs/common';
import { SeriesService } from './series.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

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
  create(@Req() req: any, @Body() body: { name: string; description?: string }) {
    return this.seriesService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'editor')
  update(@Param('id') id: string, @Req() req: any, @Body() body: { name?: string; description?: string }) {
    return this.seriesService.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'editor')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.seriesService.remove(+id);
  }
}
