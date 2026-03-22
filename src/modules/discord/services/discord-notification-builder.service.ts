import { Injectable, Logger } from '@nestjs/common';
import type {
  NotificationEvent,
  ManualNotificationContent,
  GithubNotificationContent,
} from '@/types/internal/notification-event';
import type { DiscordNotificationPayload } from '@/types/external/discord';
import { NotificationBuilderImpl } from '@/types/internal/notification-platform';

@Injectable()
export class DiscordNotificationBuilder implements NotificationBuilderImpl<DiscordNotificationPayload> {
  private readonly logger = new Logger(DiscordNotificationBuilder.name);

  build(event: NotificationEvent): DiscordNotificationPayload {
    switch (event.source) {
      case 'manual':
        return this.buildManualNotification(event.content);
      case 'github':
        return this.buildGithubNotification(event.content);
    }
  }

  private buildManualNotification(
    content: ManualNotificationContent,
  ): DiscordNotificationPayload {
    switch (content.type) {
      case 'standard':
        if (content.title == null) {
          return {
            content: content.message,
          };
        } else {
          return {
            content: `# ${content.title}\n${content.message}`,
          };
        }
    }
  }

  private buildGithubNotification(
    content: GithubNotificationContent,
  ): DiscordNotificationPayload {
    const dummy = {
      content: `New pull request in ${content.repository} by ${content.actor}`,
    };

    return dummy;
  }
}
