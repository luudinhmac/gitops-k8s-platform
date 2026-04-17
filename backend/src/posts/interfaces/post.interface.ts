import { User } from '../../users/interfaces/user.interface';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content?: string;
  series_id?: number;
  series_order?: number;
  cover_image?: string;
  is_pinned: boolean;
  is_published: boolean;
  views: number;
  likes: number;
  created_at: Date;
  updated_at: Date;
  category_id?: number;
  author_id?: number;
  User?: Partial<User>;
  Category?: any;
  Tag?: any[];
  Series?: any;
  _count?: {
    Comment: number;
    PostLike: number;
  };
}
