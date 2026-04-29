import { userApi } from '../api/user-api';
import { User, UpdateUserDto } from '@/types';

/**
 * @deprecated Use userApi or useUsers hook instead.
 * Keeping this for backward compatibility during transition.
 */
export const userService = {
  getProfile: userApi.getProfile,
  getById: userApi.getById,
  updateProfile: userApi.updateProfile,
  changePassword: userApi.changePassword,
  getAll: userApi.getAll,
  create: userApi.create,
  delete: userApi.delete,
  
  // Legacy methods mapping to new API structure
  async toggleStatus(id: number, isActive: boolean) {
    return userApi.updatePermissions(id, { is_active: !isActive });
  },

  async updateRole(id: number, role: string) {
    return userApi.updatePermissions(id, { role });
  },

  updatePermissions: userApi.updatePermissions,
  resetPassword: userApi.resetPassword,
  uploadAvatar: userApi.uploadAvatar,
};
