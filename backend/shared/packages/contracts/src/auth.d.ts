export interface LoginDto {
    username: string;
    password: string;
}
export interface RegisterDto {
    username: string;
    email: string;
    password: string;
    fullname?: string;
    phone?: string;
    birthday?: string;
    profession?: string;
}
