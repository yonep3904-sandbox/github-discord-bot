import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { NotificationQueueService } from './notification-queue.service';
import { retry } from '@/lib/retry';
import { getErrorStack } from '@/utils/error';
import type { NotificationPlatform } from '@/types/internal/notification-platform';
import type { DiscordNotificationPayload } from '@/types/external/discord';
import { DISCORD_PLATFORM } from '@/modules/discord';
import {
  NOTIFICATION_CONFIG,
  type NotificationConfig,
} from './notification-config-provider.service';

@Injectable()
export class NotificationDispatcher implements OnModuleInit {
  private readonly logger = new Logger(NotificationDispatcher.name);
  private readonly dequeueDelay = 100;
  private isRunning = false;

  constructor(
    @Inject(NOTIFICATION_CONFIG)
    private readonly config: NotificationConfig,

    @Inject(DISCORD_PLATFORM)
    private readonly platform: NotificationPlatform<DiscordNotificationPayload>,

    private readonly queue: NotificationQueueService,
  ) {}

  onModuleInit() {
    this.start();
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;

    // 非同期ループのクラッシュを握り潰さない
    this.loop().catch((err: unknown) => {
      this.logger.error('Dispatcher crashed', getErrorStack(err));
      this.isRunning = false;
    });
  }

  stop() {
    this.isRunning = false;
  }

  private async loop() {
    // 順序優先：1件ずつ処理（並列化しない）
    while (this.isRunning) {
      const job = this.queue.dequeue();

      if (!job) {
        await this.sleep(this.dequeueDelay);
        continue;
      }

      try {
        const payload = this.platform.builder.build(job.event);

        await retry(
          () => this.platform.sender.send(payload),
          this.config.retryCount,
          this.config.retryInterval,
        );
      } catch (err: unknown) {
        this.logger.error(
          `Notification dropped: job=${job.id}`,
          getErrorStack(err),
        );
      }
    }
  }

  private sleep(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
  }
}
