import { useState, useCallback } from 'react';
import { User, UpdateUserDto } from '@/types';
import { userApi } from '../api/user-api';
import { toast } from 'react-hot-toast';

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePermissions = async (id: number, data: any) => {
    try {
      await userApi.updatePermissions(id, data);
      toast.success('Cập nhật quyền hạn thành công');
      fetchUsers();
    } catch (error) {
      toast.error('Cập nhật quyền hạn thất bại');
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try {
      await userApi.delete(id);
      toast.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      toast.error('Xóa người dùng thất bại');
    }
  };

  return {
    users,
    loading,
    fetchUsers,
    updatePermissions,
    deleteUser,
  };
};
