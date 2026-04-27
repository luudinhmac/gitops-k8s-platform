export class NotificationEntity {
  id: number;
  recipient_id: number;
  sender_id?: number | null;
  type: string;
  title: string;
  content: string;
  link?: string | null;
  is_read: boolean;
  created_at: Date;

  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
  }
}
