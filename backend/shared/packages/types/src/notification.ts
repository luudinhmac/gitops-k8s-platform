export interface Notification {
  id: number;
  recipient_id: number;
  sender_id?: number | null;
  type: string;
  title: string;
  content: string;
  link?: string | null;
  is_read: boolean;
  created_at: Date | string;
  Sender?: {
    id: number;
    fullname: string | null;
    avatar: string | null;
  } | null;
}

export interface CreateNotificationDto {
  recipient_id: number;
  sender_id?: number | null;
  type: string;
  title: string;
  content: string;
  link?: string | null;
}
