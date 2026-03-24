import { Module } from '@nestjs/common';
import { NotificationModule } from '@/modules/notifications';
import { GithubController } from './github.controller';
import {
  GithubWebhookNotificationService,
  GithubWebhookNotificationTransformer,
} from './service';

@Module({
  imports: [NotificationModule],
  controllers: [GithubController],
  providers: [
    GithubWebhookNotificationService,
    GithubWebhookNotificationTransformer,
  ],
})
export class GithubModule {}
