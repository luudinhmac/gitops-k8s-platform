import { User } from './users';

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
  Recipient?: Partial<User>;
  Sender?: Partial<User> | null;
}
