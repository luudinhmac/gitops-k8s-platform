import { useState, useCallback } from 'react';
import { Category } from '@/types';
import { categoryApi } from '../api/category-api';
import { toast } from 'react-hot-toast';

export const useCategories = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (name: string) => {
    try {
      await categoryApi.create({ name });
      toast.success('Tạo danh mục thành công');
      fetchCategories();
    } catch (error) {
      toast.error('Tạo danh mục thất bại');
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    try {
      await categoryApi.delete(id);
      toast.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (error) {
      toast.error('Xóa danh mục thất bại');
    }
  };

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    deleteCategory,
  };
};
