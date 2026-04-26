export class CreatePostDto {
  title: string;
  slug?: string;
  content?: string;
  category_id?: number;
  series_id?: number;
  series_order?: number;
  cover_image?: string;
  is_pinned?: boolean;
  is_published?: boolean;
  tags?: string;
  series_name?: string;
}

export class UpdatePostDto {
  title?: string;
  slug?: string;
  content?: string;
  category_id?: number;
  series_id?: number;
  series_order?: number;
  cover_image?: string;
  is_pinned?: boolean;
  is_published?: boolean;
  tags?: string;
  series_name?: string;
}
