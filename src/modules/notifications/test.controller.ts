import { Controller, Post } from '@nestjs/common';
import { NotificationReceiver } from './services';

@Controller('test')
export class TestController {
  constructor(private readonly receiver: NotificationReceiver) {}

  @Post('send')
  sendTestNotification() {
    this.receiver.notify({
      source: 'manual',
      type: 'custom',
      title: 'Test Notification',
      message: 'This is a test notification from NestJS 🚀',
      level: 'info',
    });

    return { message: 'enqueued' };
  }
}
