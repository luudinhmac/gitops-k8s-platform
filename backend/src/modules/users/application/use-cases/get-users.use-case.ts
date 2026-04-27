import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository, I_USERS_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { User } from '@portfolio/types';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
  ) {}

  async execute(): Promise<Partial<User>[]> {
    return this.userRepository.findAll({
      orderBy: { created_at: 'desc' },
    });
  }
}
