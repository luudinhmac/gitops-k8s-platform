import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { I_USERS_REPOSITORY } from './domain/user.repository.interface';
import { AdminAlertModule } from '../admin-alert/admin-alert.module';
import { NotificationsModule } from '../notifications/presentation/notifications.module';
import { StorageModule } from '../../infrastructure/storage/storage.module';

// Use Cases
import { GetUsersUseCase } from './services/get-users.use-case';
import { GetUserUseCase } from './services/get-user.use-case';
import { CreateUserUseCase } from './services/create-user.use-case';
import { UpdateUserUseCase } from './services/update-user.use-case';
import { UpdateUserPermissionsUseCase } from './services/update-user-permissions.use-case';
import { ResetPasswordUseCase } from './services/reset-password.use-case';
import { ChangePasswordUseCase } from './services/change-password.use-case';
import { DeleteUserUseCase } from './services/delete-user.use-case';

@Module({
  imports: [
    AdminAlertModule,
    NotificationsModule,
    StorageModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: I_USERS_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    GetUsersUseCase,
    GetUserUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    UpdateUserPermissionsUseCase,
    ResetPasswordUseCase,
    ChangePasswordUseCase,
    DeleteUserUseCase,
  ],
  exports: [I_USERS_REPOSITORY, GetUserUseCase, CreateUserUseCase],
})
export class UsersModule {}
