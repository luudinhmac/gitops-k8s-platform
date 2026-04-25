import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminAlertModule } from '../../admin-alert/admin-alert.module';

@Module({
  imports: [PrismaModule, AdminAlertModule],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
