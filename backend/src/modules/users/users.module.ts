import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { NotificationsModule } from '../notifications/notifications.module';
<<<<<<< HEAD
import { AdminAlertModule } from '../../admin-alert/admin-alert.module';
import { UsersRepository } from './users.repository';
=======
import { AdminAlertModule } from '../admin-alert/admin-alert.module';
import { UsersRepository } from './repositories/user.repository';
import { I_USERS_REPOSITORY } from './repositories/user.repository.interface';
>>>>>>> feature/arch-refactor

@Module({
  imports: [
    PrismaModule,
    UploadModule,
    NotificationsModule,
    AdminAlertModule,
  ],
  controllers: [UsersController],
<<<<<<< HEAD
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
=======
  providers: [
    UsersService,
    {
      provide: I_USERS_REPOSITORY,
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService, I_USERS_REPOSITORY],
>>>>>>> feature/arch-refactor
})
export class UsersModule {}
