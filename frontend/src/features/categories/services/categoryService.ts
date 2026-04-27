import { categoryApi } from '../api/category-api';

/**
 * @deprecated Use categoryApi or useCategories hook instead.
 * Keeping this for backward compatibility during transition.
 */
export const categoryService = {
  getAll: categoryApi.getAll,
  create: async (name: string) => categoryApi.create({ name }),
  update: async (id: number, name: string) => categoryApi.update(id, { name }),
  delete: categoryApi.delete,
};
