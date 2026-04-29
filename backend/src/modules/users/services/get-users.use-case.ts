import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository, I_USERS_REPOSITORY } from '../domain/user.repository.interface';
import { User } from '@portfolio/contracts';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
  ) {}

  async execute(): Promise<User[]> {
    const users = await this.userRepository.findAll({
      orderBy: { created_at: 'desc' }
    });
    return users.map(user => user.toJSON() as unknown as User);
  }
}
