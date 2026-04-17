export class LoginDto {
  username: string;
  password: string;
}

export class RegisterDto {
  username: string;
  email: string;
  password: string;
  fullname?: string;
  phone?: string;
  birthday?: string;
  profession?: string;
}
