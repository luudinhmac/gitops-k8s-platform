import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AdminAlertModule } from '../../admin-alert/admin-alert.module';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    PrismaModule,
    UploadModule,
    NotificationsModule,
    AdminAlertModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
