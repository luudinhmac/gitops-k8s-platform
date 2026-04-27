import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUsersRepository, I_USERS_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { User } from '@portfolio/types';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
  ) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user;
  }
}
