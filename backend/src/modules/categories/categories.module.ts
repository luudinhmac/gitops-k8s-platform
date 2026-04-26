import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminAlertModule } from '../admin-alert/admin-alert.module';
import { CategoriesRepository } from './repositories/category.repository';
import { I_CATEGORIES_REPOSITORY } from './repositories/category.repository.interface';

@Module({
  imports: [PrismaModule, AdminAlertModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: I_CATEGORIES_REPOSITORY,
      useClass: CategoriesRepository,
    },
  ],
  exports: [CategoriesService, I_CATEGORIES_REPOSITORY],
})
export class CategoriesModule {}
