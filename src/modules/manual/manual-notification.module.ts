import { Module } from '@nestjs/common';
import { ManualNotificationController } from './manual-notification.controller';
import { ManualNotificationService } from './services';
import { NotificationModule } from '@/modules/notifications';

@Module({
  imports: [NotificationModule],
  controllers: [ManualNotificationController],
  providers: [ManualNotificationService],
})
export class ManualNotificationModule {}
