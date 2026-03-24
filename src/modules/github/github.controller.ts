import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  UseFilters,
} from '@nestjs/common';
import { NotificationExceptionFilter } from '@/modules/manual/notification-exception.filter';
import type { GithubWebhookEventName } from '@/types/external/github';
import { GithubWebhookNotificationService } from './service';

@UseFilters(NotificationExceptionFilter)
@Controller('github')
export class GithubController {
  constructor(private readonly service: GithubWebhookNotificationService) {}

  @Post('webhook')
  @HttpCode(200)
  receiveWebhook(
    @Headers('x-github-event') eventName: GithubWebhookEventName | null,
    @Body() payload: unknown,
  ): { message: string; eventName: GithubWebhookEventName } {
    if (eventName == null) {
      throw new BadRequestException('Missing x-github-event header');
    }
    const notified = this.service.notify(eventName, payload);

    return {
      message: notified
        ? 'GitHub notification enqueued successfully'
        : 'GitHub event ignored',
      eventName,
    };
  }
}
