import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ManualNotificationService } from './services';
import { ManualStandardNotificationDto } from './dto';
import { NotificationExceptionFilter } from './notification-exception.filter';

@UseFilters(NotificationExceptionFilter)
@Controller('notification')
export class ManualNotificationController {
  constructor(private readonly service: ManualNotificationService) {}

  @Post()
  send(@Body() dto: ManualStandardNotificationDto): {
    message: string;
    data: ManualStandardNotificationDto;
  } {
    this.service.sendStandard({ title: dto.title, message: dto.message });

    return {
      message: 'Notification enqueued successfully',
      data: dto,
    };
  }
}
