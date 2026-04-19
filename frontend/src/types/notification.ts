export interface Notification {
  id: number;
  recipient_id: number;
  sender_id?: number;
  type: 'COMMENT_ON_POST' | 'REPLY_TO_COMMENT' | 'USER_STATUS_CHANGE' | 'USER_PERMISSION_CHANGE' | 'POST_BLOCKED';
  title: string;
  content: string;
  link?: string;
  is_read: boolean;
  created_at: string;
  Sender?: {
    id: number;
    fullname: string;
    avatar: string;
  };
}
