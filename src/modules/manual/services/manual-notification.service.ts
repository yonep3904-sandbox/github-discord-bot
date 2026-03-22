import { Injectable } from '@nestjs/common';
import { NotificationReceiver } from '@/modules/notifications';
import type { NotificationEvent } from '@/types/internal/notification-event';

@Injectable()
export class ManualNotificationService {
  constructor(private readonly receiver: NotificationReceiver) {}

  sendStandard({ title, message }: { title: string | null; message: string }) {
    const event: NotificationEvent = {
      source: 'manual',
      content: {
        type: 'standard',
        title: title,
        message: message,
      },
    };

    this.receiver.notify(event);
  }
}
