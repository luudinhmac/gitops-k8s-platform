import { categoryApi } from '../api/category-api';

/**
 * @deprecated Use categoryApi or useCategories hook instead.
 * Keeping this for backward compatibility during transition.
 */
export const categoryService = {
  getAll: categoryApi.getAll,
  create: async (name: string, parent_id?: number | null) => 
    categoryApi.create({ name, parent_id: parent_id ?? undefined }),
  update: async (id: number, name: string, parent_id?: number | null) => 
    categoryApi.update(id, { name, parent_id: parent_id ?? undefined }),
  delete: categoryApi.delete,
};
