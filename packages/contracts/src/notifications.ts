export interface Notification {
  id: number;
  recipient_id: number;
  sender_id?: number;
  type: string;
  title: string;
  content: string;
  link?: string;
  is_read: boolean;
  created_at: Date | string;
  Sender?: {
    id: number;
    fullname: string;
    avatar: string | null;
  };
}

export interface CreateNotificationDto {
  recipient_id: number;
  sender_id?: number;
  type: string;
  title: string;
  content: string;
  link?: string;
}
