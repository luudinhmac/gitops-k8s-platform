import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '@portfolio/contracts';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// Use Cases
import { GetCategoriesUseCase } from '../../application/use-cases/get-categories.use-case';
import { GetCategoryUseCase } from '../../application/use-cases/get-category.use-case';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use-cases/delete-category.use-case';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  findAll() {
    return this.getCategoriesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  findOne(@Param('id') id: string) {
    return this.getCategoryUseCase.execute(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new category' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.createCategoryUseCase.execute(createCategoryDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.updateCategoryUseCase.execute(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.deleteCategoryUseCase.execute(+id);
  }
}
