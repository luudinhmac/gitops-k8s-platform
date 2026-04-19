import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  recipient_id: number;

  @IsInt()
  @IsOptional()
  sender_id?: number;

  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  link?: string;
}
