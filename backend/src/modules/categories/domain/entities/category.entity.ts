export class CategoryEntity {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  _count?: {
    Post: number;
  };

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
