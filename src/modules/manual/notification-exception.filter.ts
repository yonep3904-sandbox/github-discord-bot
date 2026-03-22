import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import {
  InvalidNotificationError,
  QueueOverflowError,
} from '@/modules/notifications/errors';
import { ExternalApiError } from '@/errors';

@Catch()
export class NotificationExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof QueueOverflowError) {
      return response.status(HttpStatus.TOO_MANY_REQUESTS).json({
        message: 'Queue is full',
      });
    }

    if (exception instanceof InvalidNotificationError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: exception.message,
      });
    }

    if (exception instanceof ExternalApiError) {
      return response.status(HttpStatus.BAD_GATEWAY).json({
        message: `${exception.service} API error`,
        status: exception.status,
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
    });
  }
}
