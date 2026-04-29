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

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundException(id);
    return user as unknown as User;
  }
}
