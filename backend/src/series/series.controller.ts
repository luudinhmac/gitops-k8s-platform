import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Patch, ForbiddenException } from '@nestjs/common';
import { SeriesService } from './series.service';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req: any, @Body() body: { name: string; description?: string }) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Only admin can create series');
    return this.seriesService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Req() req: any, @Body() body: { name?: string; description?: string }) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Only admin can update series');
    return this.seriesService.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Only admin can delete series');
    return this.seriesService.remove(+id);
  }
}
