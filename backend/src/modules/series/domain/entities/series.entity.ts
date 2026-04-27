export class SeriesEntity {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
  _count?: {
    Post: number;
  };
  Post?: any[];

  constructor(partial: Partial<SeriesEntity>) {
    Object.assign(this, partial);
  }
}
