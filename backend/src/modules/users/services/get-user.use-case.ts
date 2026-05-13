import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository, I_USERS_REPOSITORY } from '../domain/user.repository.interface';
import { User } from '@portfolio/contracts';
import { UserNotFoundException } from '../domain/user.errors';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
  ) {}

  async execute(id: number, currentUser?: any): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundException(id);

    const userData = user.toJSON() as unknown as User;

    // Nếu không phải Admin và không phải chính chủ, lọc bỏ thông tin nhạy cảm
    const isAdmin = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';
    const isOwner = currentUser?.id === id;

    if (!isAdmin && !isOwner) {
      return {
        id: userData.id,
        username: userData.username,
        fullname: userData.fullname,
        avatar: userData.avatar,
        profession: userData.profession,
        is_active: userData.is_active,
        can_comment: userData.can_comment,
        can_post: userData.can_post,
        created_at: userData.created_at,
        role: userData.role,
        email: undefined,
        phone: undefined,
        address: undefined,
      } as unknown as User;
    }

    return userData;
  }
}
