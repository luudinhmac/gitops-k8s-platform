import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { IUsersRepository, I_USERS_REPOSITORY } from '../domain/user.repository.interface';
import { User, UserRole, UpdateUserDto } from '@portfolio/contracts';
import { MediaManagerService } from '../../upload/media-manager.service';
import { UserNotFoundException } from '../domain/user.errors';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
    private readonly mediaManager: MediaManagerService,
  ) {}

  async execute(id: number, currentUser: User, data: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundException(id);

    // Only self or Admin can update
    const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPERADMIN;
    if (currentUser.id !== id && !isAdmin) {
      throw new ForbiddenException('Bạn không có quyền cập nhật thông tin này.');
    }

    // Avatar usage registration
    if (data.avatar && data.avatar !== user.avatar) {
      // Register new usage
      await this.mediaManager.registerUsage(data.avatar, 'USER', id, 'avatar');
      
      // Cleanup old usage
      if (user.avatar) {
        await this.mediaManager.unregisterUsage(user.avatar, 'USER', id, 'avatar');
      }
    }

    const updatedUser = await this.userRepository.update(id, data);
    return updatedUser.toJSON();
  }
}
