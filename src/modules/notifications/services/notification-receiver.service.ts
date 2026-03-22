import { Injectable } from '@nestjs/common';
import { NotificationQueueService } from './notification-queue.service';
import type { NotificationEvent } from '@/types/internal/notification-event';
import { InvalidNotificationError } from '../errors';

@Injectable()
export class NotificationReceiver {
  constructor(private readonly queue: NotificationQueueService) {}

  notify(event: NotificationEvent) {
    if (!this.validate(event)) {
      throw new InvalidNotificationError('Invalid notification event');
    }

    this.queue.enqueue(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private validate(event: NotificationEvent): boolean {
    // ---- 方針：シンプルに受け入れる（将来的にバリデーションルールを追加する余地を残す） ----
    return true;
  }
}
