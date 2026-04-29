import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@portfolio/contracts';

@Injectable()
export class LoginUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(user: User) {
    const payload = { id: user.id, username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        avatar: user.avatar,
        role: user.role,
        phone: user.phone,
        profession: user.profession,
        birthday: user.birthday,
        address: user.address,
        can_comment: user.can_comment,
        can_post: user.can_post,
      },
    };
  }
}
