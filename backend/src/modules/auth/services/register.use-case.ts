import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from '@portfolio/contracts';
import { CreateUserUseCase } from '../../users/services/create-user.use-case';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async execute(data: RegisterDto) {
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/.test(data.password)) {
      throw new BadRequestException('Mật khẩu phải tối thiểu 8 ký tự, bao gồm cả chữ và số.');
    }

    // Auth module handles registration by delegating to Users module
    return this.createUserUseCase.execute(data as any);
  }
}
