export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: number | null;
  Parent?: Category | null;
  Children?: Category[] | null;
  _count?: {
    Post: number;
  };
}

export interface CreateCategoryDto {
  name: string;
  description?: string | null;
  slug?: string | null;
  parent_id?: number | null;
}

export interface UpdateCategoryDto {
  name?: string | null;
  description?: string | null;
  slug?: string | null;
  parent_id?: number | null;
}
