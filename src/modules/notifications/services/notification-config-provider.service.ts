import { Provider } from '@nestjs/common';
import { Config } from '@/config/config';

export const NOTIFICATION_CONFIG = Symbol('NOTIFICATION_CONFIG');

export type NotificationConfig = {
  retryCount: number; // 5xx: server error
  retryInterval: number;
};

export const NotificationConfigProvider: Provider = {
  provide: NOTIFICATION_CONFIG,
  useFactory: () => {
    const config = Config.get();
    const api = config.apiRequest;

    return {
      retryCount: api.retry.others.count,
      retryInterval: api.retry.others.interval,
    } satisfies NotificationConfig;
  },
};
