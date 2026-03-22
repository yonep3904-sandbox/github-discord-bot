import { Injectable, Logger } from '@nestjs/common';
import type { NotificationEvent } from '@/types/internal/notification-event';
import type { DiscordNotificationPayload } from '@/types/external/discord';
import { NotificationBuilderImpl } from '@/types/internal/notification-platform';

@Injectable()
export class DiscordNotificationBuilder implements NotificationBuilderImpl<DiscordNotificationPayload> {
  private readonly logger = new Logger(DiscordNotificationBuilder.name);

  build(event: NotificationEvent): DiscordNotificationPayload {
    const payload = {
      content: `[dummy] New event: ${event.type}`,
    };
    return payload;
  }
}
