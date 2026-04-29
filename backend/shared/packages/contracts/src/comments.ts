import { ApiProperty } from '@nestjs/swagger';
import { User } from './users';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEmail } from 'class-validator';

export class Comment {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false })
  post_id?: number;

  @ApiProperty({ required: false })
  user_id?: number;

  @ApiProperty({ required: false })
  parent_id?: number;

  @ApiProperty({ required: false })
  author_name?: string;

  @ApiProperty({ required: false })
  author_email?: string;

  @ApiProperty({ required: false })
  content?: string;

  @ApiProperty({ type: String })
  created_at: Date | string;

  @ApiProperty({ required: false })
  User?: Partial<User>;

  @ApiProperty({ required: false, type: () => [Comment] })
  Replies?: Comment[];
}

export class CreateCommentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  author_name?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  author_email?: string;
}

export class UpdateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
