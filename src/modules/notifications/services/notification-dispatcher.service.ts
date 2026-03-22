import {
  Injectable,
  Logger,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
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
import { EnvVariable } from '@/config/env_variable';

@Injectable()
export class NotificationDispatcher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationDispatcher.name);
  private readonly dequeueDelay: number = 100;
  private isRunning: boolean = false;
  private forceStop: boolean = false;

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

  onModuleDestroy() {
    this.stop();
  }

  start() {
    if (this.isRunning) return;
    if (EnvVariable.get().node.test) {
      this.logger.warn(
        'Running in test environment, dispatcher will not start',
      );
      return;
    }

    this.logger.log('Starting dispatcher...');

    this.isRunning = true;

    // 非同期ループのクラッシュを握り潰さない
    this.loop().catch((err: unknown) => {
      this.logger.error('Dispatcher crashed', getErrorStack(err));
      this.isRunning = false;
    });
  }

  stop(force: boolean = false) {
    this.logger.log(`Stopping dispatcher (force=${force})...`);

    this.isRunning = false;
    this.forceStop = force;
  }

  private async loop() {
    // Graceful shutdown
    while ((this.isRunning || !this.queue.isEmpty()) && !this.forceStop) {
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
