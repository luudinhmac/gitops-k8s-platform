import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AdminAlertModule } from '../admin-alert/admin-alert.module';
import { UsersRepository } from './repositories/user.repository';
import { I_USERS_REPOSITORY } from './repositories/user.repository.interface';

@Module({
  imports: [
    PrismaModule,
    UploadModule,
    NotificationsModule,
    AdminAlertModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: I_USERS_REPOSITORY,
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService, I_USERS_REPOSITORY],
})
export class UsersModule {}
