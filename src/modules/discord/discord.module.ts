import { Module } from '@nestjs/common';
import { DiscordWebhookService } from './services/discord-webhook.service';

@Module({
  providers: [DiscordWebhookService],
  exports: [DiscordWebhookService],
})
export class DiscordModule {}
