import { IsString, IsOptional, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryCount {
  @ApiProperty()
  Post: number;
}

export class Category {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  parent_id?: number;

  @ApiProperty({ required: false, type: () => Category })
  Parent?: Category;

  @ApiProperty({ required: false, type: () => [Category] })
  Children?: Category[];

  @ApiProperty({ required: false, type: () => CategoryCount })
  _count?: CategoryCount;
}

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  parent_id?: number;
}

export class UpdateCategoryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  parent_id?: number;
}
