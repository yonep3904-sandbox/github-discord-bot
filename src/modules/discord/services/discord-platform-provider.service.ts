import { Provider } from '@nestjs/common';

import { DiscordNotificationBuilder } from './discord-notification-builder.service';
import { DiscordNotificationSender } from './discord-notification-sender.service';
import type { NotificationPlatform } from '@/types/internal/notification-platform';
import type { DiscordNotificationPayload } from '@/types/external/discord';

export const DISCORD_PLATFORM = Symbol('DISCORD_NOTIFICATION_PLATFORM');

export const DiscordPlatformProvider: Provider = {
  provide: DISCORD_PLATFORM,
  useFactory: (
    sender: DiscordNotificationSender,
    builder: DiscordNotificationBuilder,
  ): NotificationPlatform<DiscordNotificationPayload> => ({
    sender,
    builder,
  }),
  inject: [DiscordNotificationSender, DiscordNotificationBuilder],
};
