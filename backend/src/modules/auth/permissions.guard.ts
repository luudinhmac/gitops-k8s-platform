import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<any>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này.',
      );
    }

    // 1. superadmin bypasses all permission checks
    if (user.role === 'superadmin') {
      return true;
    }

    // 2. Check each required permission key against the flat property resolved by UserMapper
    const permissionMap: Record<string, string> = {
      'categories:manage': 'can_manage_categories',
      'series:manage': 'can_manage_series',
      'comments:manage': 'can_manage_comments',
      'settings:manage': 'can_manage_settings',
      'users:manage': 'can_manage_users',
      'posts:create': 'can_post',
      'comments:create': 'can_comment',
    };

    const hasAll = requiredPermissions.every((permKey) => {
      const userProp = permissionMap[permKey];
      if (userProp) {
        return !!user[userProp];
      }
      return false;
    });

    if (!hasAll) {
      throw new ForbiddenException(
        'Bạn không có đủ quyền hạn để thực hiện hành động này.',
      );
    }

    return true;
  }
}
