import { ApiProperty } from '@nestjs/swagger';

export class Notification {
  @ApiProperty()
  id: number;

  @ApiProperty()
  recipient_id: number;

  @ApiProperty({ required: false })
  sender_id?: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ required: false })
  link?: string;

  @ApiProperty()
  is_read: boolean;

  @ApiProperty({ type: String })
  created_at: Date | string;

  @ApiProperty({ required: false })
  Sender?: {
    id: number;
    fullname: string;
    avatar: string | null;
  };
}

export class CreateNotificationDto {
  @ApiProperty()
  recipient_id: number;

  @ApiProperty({ required: false })
  sender_id?: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ required: false })
  link?: string;
}
