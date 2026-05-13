import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository, I_USERS_REPOSITORY } from '../domain/user.repository.interface';
import { User } from '@portfolio/contracts';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
  ) {}

  async execute(currentUser?: any): Promise<User[]> {
    const users = await this.userRepository.findAll({
      orderBy: { created_at: 'desc' }
    });
    
    return users.map(user => {
      const userData = user.toJSON() as unknown as User;
      
      // Nếu không phải Admin/SuperAdmin, lọc bỏ các thông tin nhạy cảm
      const isAdmin = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';
      
      if (!isAdmin) {
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
          // Ẩn email, phone, address, role đối với người dùng thường
          email: undefined,
          phone: undefined,
          address: undefined,
          role: userData.role, // Vẫn giữ role để hiển thị cấp bậc nếu cần, hoặc ẩn đi
        } as unknown as User;
      }
      
      return userData;
    });
  }
}
