export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullname?: string | null;
  phone?: string | null;
  birthday?: string | null;
  profession?: string | null;
}
