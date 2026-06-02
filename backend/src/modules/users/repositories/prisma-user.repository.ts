import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IUsersRepository } from '../domain/user.repository.interface';
import { UserEntity } from '../domain/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { CreateUserDto, UpdateUserDto } from '@portfolio/contracts';

const defaultInclude = {
  Profile: true,
  Role: {
    include: {
      Permissions: {
        include: {
          Permission: true,
        },
      },
    },
  },
  Permissions: {
    include: {
      Permission: true,
    },
  },
};

@Injectable()
export class PrismaUserRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: any): Promise<UserEntity[]> {
    const queryParams = {
      ...params,
      include: {
        ...params?.include,
        ...defaultInclude,
      },
    };
    const users = await this.prisma.user.findMany(queryParams);
    return users.map((user) => UserMapper.toDomain(user) as UserEntity);
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: defaultInclude,
    });
    return UserMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: defaultInclude,
    });
    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: defaultInclude,
    });
    return UserMapper.toDomain(user);
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    const {
      fullname,
      avatar,
      profession,
      phone,
      birthday,
      address,
      role,
      ...userData
    } = data as any;

    let role_id: number | undefined;
    if (role) {
      const foundRole = await this.prisma.role.findUnique({
        where: { name: role as string },
      });
      if (foundRole) {
        role_id = foundRole.id;
      }
    }

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        role_id,
        Profile: {
          create: {
            fullname,
            avatar,
            profession,
            phone,
            birthday: birthday ? new Date(birthday) : undefined,
            address,
          },
        },
      },
      include: defaultInclude,
    });
    return UserMapper.toDomain(user) as UserEntity;
  }

  async update(id: number, data: UpdateUserDto): Promise<UserEntity> {
    const {
      fullname,
      avatar,
      profession,
      phone,
      birthday,
      address,
      role,
      can_manage_categories,
      can_manage_series,
      can_manage_comments,
      can_manage_settings,
      can_manage_users,
      can_comment,
      can_post,
      ...userData
    } = data as any;

    let role_id: number | undefined;
    if (role) {
      const foundRole = await this.prisma.role.findUnique({
        where: { name: role as string },
      });
      if (foundRole) {
        role_id = foundRole.id;
      }
    }

    const profileData: any = {};
    if (fullname !== undefined) profileData.fullname = fullname;
    if (avatar !== undefined) profileData.avatar = avatar;
    if (profession !== undefined) profileData.profession = profession;
    if (phone !== undefined) profileData.phone = phone;
    if (birthday !== undefined)
      profileData.birthday = birthday ? new Date(birthday) : null;
    if (address !== undefined) profileData.address = address;

    const updatePayload: any = {
      ...userData,
    };
    if (role_id !== undefined) updatePayload.role_id = role_id;

    if (Object.keys(profileData).length > 0) {
      updatePayload.Profile = {
        upsert: {
          create: profileData,
          update: profileData,
        },
      };
    }

    // Save custom permission overrides if provided
    const permissionUpdates: Array<{ key: string; value?: boolean }> = [
      { key: 'comments:create', value: can_comment },
      { key: 'posts:create', value: can_post },
      { key: 'categories:manage', value: can_manage_categories },
      { key: 'series:manage', value: can_manage_series },
      { key: 'comments:manage', value: can_manage_comments },
      { key: 'settings:manage', value: can_manage_settings },
      { key: 'users:manage', value: can_manage_users },
    ];

    for (const item of permissionUpdates) {
      if (item.value !== undefined) {
        const permission = await this.prisma.permission.findUnique({
          where: { key: item.key },
        });
        if (permission) {
          if (item.value === true) {
            await this.prisma.userPermission.upsert({
              where: {
                user_id_permission_id: {
                  user_id: id,
                  permission_id: permission.id,
                },
              },
              update: { value: 'ALLOW' },
              create: {
                user_id: id,
                permission_id: permission.id,
                value: 'ALLOW',
              },
            });
          } else {
            await this.prisma.userPermission.upsert({
              where: {
                user_id_permission_id: {
                  user_id: id,
                  permission_id: permission.id,
                },
              },
              update: { value: 'DENY' },
              create: {
                user_id: id,
                permission_id: permission.id,
                value: 'DENY',
              },
            });
          }
        }
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updatePayload,
      include: defaultInclude,
    });
    return UserMapper.toDomain(user) as UserEntity;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.user.count({ where });
  }
}
