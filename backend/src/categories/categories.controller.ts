import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Patch } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req: any, @Body() body: { name: string }) {
    if (req.user.role !== 'admin') throw new Error('Forbidden');
    return this.categoriesService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Req() req: any, @Body() body: { name: string }) {
    if (req.user.role !== 'admin') throw new Error('Forbidden');
    return this.categoriesService.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.role !== 'admin') throw new Error('Forbidden');
    return this.categoriesService.remove(+id);
  }
}
