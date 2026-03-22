import { Module } from '@nestjs/common';
import {
  DiscordConfigProvider,
  DiscordNotificationBuilder,
  DiscordNotificationSender,
  DiscordPlatformProvider,
  DISCORD_PLATFORM,
} from './services';
@Module({
  providers: [
    DiscordConfigProvider,
    DiscordNotificationSender,
    DiscordNotificationBuilder,
    DiscordPlatformProvider,
  ],
  exports: [DISCORD_PLATFORM],
})
export class DiscordModule {}
