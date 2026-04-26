import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

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

export class CreateSeriesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  cover_image?: string;

  @IsString()
  @IsOptional()
  slug?: string;
}

export class UpdateSeriesDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  cover_image?: string;

  @IsString()
  @IsOptional()
  slug?: string;
}
