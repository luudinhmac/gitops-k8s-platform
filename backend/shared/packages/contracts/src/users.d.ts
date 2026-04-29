export declare enum UserRole {
    SUPERADMIN = "superadmin",
    ADMIN = "admin",
    EDITOR = "editor",
    USER = "user"
}
export interface User {
    id: number;
    username: string;
    email?: string;
    fullname?: string;
    password?: string;
    avatar?: string;
    profession?: string;
    role: UserRole | string;
    phone?: string;
    birthday?: string;
    address?: string;
    is_active: boolean;
    can_comment: boolean;
    can_post: boolean;
    created_at: Date | string;
}
export interface CreateUserDto {
    username: string;
    email: string;
    password?: string;
    fullname?: string;
    role?: UserRole | string;
    profession?: string;
    phone?: string;
    birthday?: string;
    address?: string;
    is_active?: boolean;
}
export interface UpdateUserDto {
    email?: string;
    password?: string;
    fullname?: string;
    role?: UserRole | string;
    profession?: string;
    avatar?: string;
    phone?: string;
    birthday?: string;
    address?: string;
    is_active?: boolean;
    can_comment?: boolean;
    can_post?: boolean;
}
