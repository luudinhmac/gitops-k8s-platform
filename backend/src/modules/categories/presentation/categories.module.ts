import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/categories.controller';
import { AdminAlertModule } from '../../admin-alert/admin-alert.module';
import { PrismaCategoryRepository } from '../infrastructure/repositories/prisma-category.repository';
import { I_CATEGORIES_REPOSITORY } from '../domain/repositories/category.repository.interface';

// Use Cases
import { GetCategoriesUseCase } from '../application/use-cases/get-categories.use-case';
import { GetCategoryUseCase } from '../application/use-cases/get-category.use-case';
import { CreateCategoryUseCase } from '../application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../application/use-cases/delete-category.use-case';

import { CacheConfigModule } from '../../../cache-config.module';

@Module({
  imports: [AdminAlertModule, CacheConfigModule],
  controllers: [CategoriesController],
  providers: [
    {
      provide: I_CATEGORIES_REPOSITORY,
      useClass: PrismaCategoryRepository,
    },
    GetCategoriesUseCase,
    GetCategoryUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
  exports: [I_CATEGORIES_REPOSITORY],
})
export class CategoriesModule {}
