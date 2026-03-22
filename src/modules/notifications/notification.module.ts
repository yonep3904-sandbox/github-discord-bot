import { Module } from '@nestjs/common';
import {
  NotificationConfigProvider,
  NotificationDispatcher,
  NotificationQueueService,
  NotificationReceiver,
} from './services';
import { DiscordModule } from '@/modules/discord';

@Module({
  imports: [DiscordModule],
  providers: [
    NotificationQueueService,
    NotificationDispatcher,
    NotificationConfigProvider,
    NotificationReceiver,
  ],
  exports: [NotificationReceiver],
})
export class NotificationModule {}
