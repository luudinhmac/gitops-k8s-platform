import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  _count?: {
    Post: number;
  };
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;
}
