export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  _count?: {
    Post: number;
  };
}

export interface CreateCategoryDto {
  name: string;
  description?: string | null;
  slug?: string | null;
}

export interface UpdateCategoryDto {
  name?: string | null;
  description?: string | null;
  slug?: string | null;
}
