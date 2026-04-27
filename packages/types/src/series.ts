export interface Series {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  cover_image?: string | null;
  author_id?: number | null;
  _count?: {
    Post: number;
  };
  Posts?: any[];
}

export interface CreateSeriesDto {
  name: string;
  description?: string | null;
  cover_image?: string | null;
  slug?: string | null;
}

export interface UpdateSeriesDto {
  name?: string | null;
  description?: string | null;
  cover_image?: string | null;
  slug?: string | null;
}
