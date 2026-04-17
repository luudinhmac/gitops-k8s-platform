export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  content: string;
  author_name: string;
  author_email: string | null;
  created_at: string;
  user_id?: number | null;
  User?: {
    avatar: string | null;
  } | null;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content?: string;
  cover_image?: string;
  views: number;
  likes: number;
  readTime?: number;
  created_at: string;
  is_published: boolean;
  excerpt?: string;
  is_pinned?: boolean;
  author_id: number;
  series_id?: number | null;
  series_order?: number;
  Category?: Category | null;
  Series?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  User?: {
    id: number;
    fullname: string;
    username: string;
    avatar?: string;
    profession?: string;
  } | null;
  Tag?: Tag[];
  Comment?: Comment[];
  prevPost?: any | null;
  nextPost?: any | null;
  _count?: {
    Comment: number;
    PostLike: number;
  };
  comment_count?: number;
}

export type SortOption = 'latest' | 'views' | 'likes' | 'comments';
