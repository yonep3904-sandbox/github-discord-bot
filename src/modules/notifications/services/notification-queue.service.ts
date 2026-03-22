import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  Queue,
  QueueOverflowError as LibQueueOverflowError,
} from '@/lib/queue';
import type {
  NotificationEvent,
  NotificationJob,
} from '@/types/internal/notification-event';
import { getErrorStack } from '@/utils/error';
import { QueueOverflowError } from '../errors';

@Injectable()
export class NotificationQueueService {
  private readonly logger = new Logger(NotificationQueueService.name);
  private queue: Queue<NotificationJob> = new Queue(50, 300);

  size(): number {
    return this.queue.size();
  }

  capacity(): number {
    return this.queue.capacity();
  }

  isEmpty(): boolean {
    return this.queue.isEmpty();
  }

  enqueue(event: NotificationEvent) {
    const job: NotificationJob = {
      id: randomUUID(),
      event,
    };

    try {
      this.queue.enqueue(job);
      this.logger.debug(`Job enqueued: ${job.id} (size=${this.queue.size()})`);
    } catch (err: unknown) {
      this.logger.error('Queue overflow', getErrorStack(err));
      if (err instanceof LibQueueOverflowError) {
        throw new QueueOverflowError('Notification queue overflow');
      }
      throw err;
    }
  }

  dequeue(): NotificationJob | undefined {
    const job = this.queue.dequeue();

    if (job) {
      this.logger.debug(
        `Job dequeued: ${job.id} (remaining=${this.queue.size()})`,
      );
    }

    return job;
  }

  peek(): NotificationJob | undefined {
    return this.queue.peek();
  }

  clear() {
    this.queue.clear();
    this.logger.debug('Queue cleared');
  }

  reserve(additional: number = 0) {
    this.queue.reserve(additional);
    this.logger.debug(`Queue reserved with additional capacity: ${additional}`);
  }
}
