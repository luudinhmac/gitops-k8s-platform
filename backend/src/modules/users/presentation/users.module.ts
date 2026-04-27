import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { NotificationsModule } from '../../notifications/presentation/notifications.module';
import { AdminAlertModule } from '../../admin-alert/admin-alert.module';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user.repository';
import { I_USERS_REPOSITORY } from '../domain/repositories/user.repository.interface';
import { StorageModule } from '../../../infrastructure/storage/storage.module';

// Use Cases
import { GetUsersUseCase } from '../application/use-cases/get-users.use-case';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { UpdateUserPermissionsUseCase } from '../application/use-cases/update-user-permissions.use-case';
import { ResetPasswordUseCase } from '../application/use-cases/reset-password.use-case';
import { ChangePasswordUseCase } from '../application/use-cases/change-password.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';

@Module({
  imports: [NotificationsModule, AdminAlertModule, StorageModule],
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
  exports: [I_USERS_REPOSITORY, GetUserUseCase],
})
export class UsersModule {}
