import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Series {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  cover_image?: string;

  @ApiProperty({ required: false })
  _count?: {
    Post: number;
  };
}

export class CreateSeriesDto {
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
  cover_image?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string;
}

export class UpdateSeriesDto {
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
  cover_image?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string;
}
