export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    _count?: {
        Post: number;
    };
}
export declare class CreateCategoryDto {
    name: string;
    description?: string;
    slug?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    description?: string;
    slug?: string;
}
