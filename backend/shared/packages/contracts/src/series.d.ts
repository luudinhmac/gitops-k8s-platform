export interface Series {
    id: number;
    name: string;
    slug: string;
    description?: string;
    cover_image?: string;
    _count?: {
        Post: number;
    };
}
export declare class CreateSeriesDto {
    name: string;
    description?: string;
    cover_image?: string;
    slug?: string;
}
export declare class UpdateSeriesDto {
    name?: string;
    description?: string;
    cover_image?: string;
    slug?: string;
}
