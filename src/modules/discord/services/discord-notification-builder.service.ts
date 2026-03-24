import { Injectable } from '@nestjs/common';
import type {
  NotificationEvent,
  ManualNotificationContent,
  GithubNotificationContent,
} from '@/types/internal/notification-event';
import type { DiscordNotificationPayload } from '@/types/external/discord';
import { NotificationBuilderImpl } from '@/types/internal/notification-platform';
import { toDiscordColor } from '@/utils/color';

@Injectable()
export class DiscordNotificationBuilder implements NotificationBuilderImpl<DiscordNotificationPayload> {
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
    return {
      embeds: [
        {
          title: content.title,
          description: content.description,
          url: content.url,
          timestamp: content.timestamp,
          author: {
            name: content.actor?.login ?? 'unknown',
            url: content.actor?.url ?? undefined,
            icon_url: content.actor?.avatarUrl ?? undefined,
          },
          footer: {
            text: `${content.type}${content.action ? ` / ${content.action}` : ''}`,
          },
          color: toDiscordColor(content.color),
          fields: content.fields,
        },
      ],
    };
  }
}
