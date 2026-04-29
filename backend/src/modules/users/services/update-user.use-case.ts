import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { IUsersRepository, I_USERS_REPOSITORY } from '../domain/user.repository.interface';
import { User, UserRole, UpdateUserDto } from '@portfolio/contracts';
import { IStorageService, STORAGE_SERVICE } from '../../../infrastructure/storage/storage.interface';
import { UserNotFoundException } from '../domain/user.errors';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}

  async execute(id: number, currentUser: User, data: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundException(id);

    // Only self or Admin can update
    const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPERADMIN;
    if (currentUser.id !== id && !isAdmin) {
      throw new ForbiddenException('Bạn không có quyền cập nhật thông tin này.');
    }

    // Avatar cleanup
    if (data.avatar && user.avatar && data.avatar !== user.avatar) {
      await this.storageService.deleteFile(user.avatar).catch(() => {});
    }

    const updatedUser = await this.userRepository.update(id, data);
    return updatedUser.toJSON();
  }
}
