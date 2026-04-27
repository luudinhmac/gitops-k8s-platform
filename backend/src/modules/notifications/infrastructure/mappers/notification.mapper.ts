import { NotificationEntity } from '../../domain/entities/notification.entity';

export class NotificationMapper {
  static toDomain(raw: any): NotificationEntity | null {
    if (!raw) return null;
    return new NotificationEntity({
      id: raw.id,
      recipient_id: raw.recipient_id,
      sender_id: raw.sender_id,
      type: raw.type,
      title: raw.title,
      content: raw.content,
      link: raw.link,
      is_read: raw.is_read,
      created_at: raw.created_at,
    });
  }
}
