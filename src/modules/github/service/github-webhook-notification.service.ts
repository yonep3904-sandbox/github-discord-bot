import { Injectable } from '@nestjs/common';
import { NotificationReceiver } from '@/modules/notifications';
import type {
  GithubWebhookEvent,
  GithubWebhookEventName,
} from '@/types/external/github';
import { GithubWebhookNotificationTransformer } from './github-webhook-notification-transformer.service';

@Injectable()
export class GithubWebhookNotificationService {
  constructor(
    private readonly receiver: NotificationReceiver,
    private readonly transformer: GithubWebhookNotificationTransformer,
  ) {}

  notify<K extends GithubWebhookEventName>(
    eventType: K,
    payload: unknown,
  ): boolean {
    const now = new Date().toISOString();

    const event = {
      type: eventType,
      payload,
      timestamp: now,
    } as GithubWebhookEvent;

    const content = this.transformer.transform(event);
    if (content == null) {
      return false;
    }

    this.receiver.notify({
      source: 'github',
      content,
    });

    return true;
  }
}
