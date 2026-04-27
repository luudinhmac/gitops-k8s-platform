import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IUsersRepository, I_USERS_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { User, UserRole, UpdateUserDto } from '@portfolio/types';
import { IStorageService, STORAGE_SERVICE } from '../../../../infrastructure/storage/storage.interface';

@Injectable()
export class UpdateUserUseCase {
  private readonly roleHierarchy: Record<string, number> = {
    [UserRole.SUPERADMIN]: 100,
    [UserRole.ADMIN]: 50,
    [UserRole.EDITOR]: 20,
    [UserRole.USER]: 10,
  };

  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}

  private canModify(currentUser: User, targetUser: { role?: string | null }): boolean {
    const currentLevel = this.roleHierarchy[currentUser.role as string] || 0;
    const targetLevel = this.roleHierarchy[targetUser.role || 'user'] || 0;

    if (currentUser.role === UserRole.SUPERADMIN) return true;
    return currentLevel > targetLevel;
  }

  async execute(id: number, currentUser: User, data: UpdateUserDto) {
    const targetUser = await this.userRepository.findById(id);
    if (!targetUser) throw new NotFoundException('Người dùng không tồn tại');

    if (!this.canModify(currentUser, targetUser) && currentUser.id !== id) {
      throw new ForbiddenException('Bạn không có quyền sửa thông tin của người dùng này.');
    }

    if (data.role) {
       const newRoleLevel = this.roleHierarchy[data.role] || 0;
       const currentLevel = this.roleHierarchy[currentUser.role as string] || 0;
       if (newRoleLevel >= currentLevel && currentUser.role !== UserRole.SUPERADMIN) {
          throw new ForbiddenException('Bạn không thể gán vai trò cao hơn hoặc bằng vai trò hiện tại của mình.');
       }
    }

    const updateData = { ...data };
    if (updateData.fullname !== undefined && (!updateData.fullname || !updateData.fullname.trim())) {
      updateData.fullname = targetUser.username;
    }

    if (updateData.avatar && targetUser.avatar && targetUser.avatar !== updateData.avatar) {
      await this.storageService.deleteFile(targetUser.avatar).catch(err => console.error('Delete avatar error:', err));
    }

    return this.userRepository.update(id, updateData);
  }
}
