import { User } from './users';
export interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    series_id?: number | null;
    series_order?: number | null;
    cover_image?: string | null;
    is_pinned: boolean;
    is_published: boolean;
    views: number;
    likes: number;
    created_at: Date | string;
    updated_at: Date | string;
    is_blocked: boolean;
    blocked_by_id?: number | null;
    blocked_reason?: string | null;
    BlockedBy?: Partial<User>;
    category_id?: number | null;
    author_id?: number | null;
    Author?: Partial<User>;
    Category?: any;
    Tag?: any[];
    Series?: any;
    Comment?: any[];
    _count?: {
        Comment: number;
        PostLike: number;
    };
    comment_count?: number;
    readTime?: number;
    prevPost?: any;
    nextPost?: any;
}
export declare class CreatePostDto {
    title: string;
    slug?: string;
    content?: string;
    category_id?: number | null;
    series_id?: number | null;
    series_order?: number | null;
    cover_image?: string | null;
    is_pinned?: boolean;
    is_published?: boolean;
    tags?: string;
    series_name?: string;
}
export declare class UpdatePostDto {
    title?: string;
    slug?: string;
    content?: string;
    category_id?: number | null;
    series_id?: number | null;
    series_order?: number | null;
    cover_image?: string | null;
    is_pinned?: boolean;
    is_published?: boolean;
    is_blocked?: boolean;
    blocked_by_id?: number | null;
    tags?: string;
    series_name?: string;
}
export type SortOption = 'newest' | 'oldest' | 'most_viewed' | 'most_liked' | 'latest' | 'views' | 'likes' | 'comments';
