import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  fullname?: string;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  profession?: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole | string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  birthday?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  can_comment: boolean;

  @ApiProperty()
  can_post: boolean;

  @ApiProperty({ type: String })
  created_at: Date | string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fullname?: string;

  @ApiProperty({ required: false, enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole | string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  profession?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  birthday?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fullname?: string;

  @ApiProperty({ required: false, enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole | string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  profession?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  birthday?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  can_comment?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  can_post?: boolean;
}
