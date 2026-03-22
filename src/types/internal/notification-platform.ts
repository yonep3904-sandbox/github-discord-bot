import type { NotificationEvent } from '@/types/internal/notification-event';

export interface NotificationSenderImpl<TPayload> {
  send(payload: TPayload): Promise<void>;
}

export interface NotificationBuilderImpl<TPayload> {
  build(event: NotificationEvent): TPayload;
}

export type NotificationPlatform<TPayload> = {
  sender: NotificationSenderImpl<TPayload>;
  builder: NotificationBuilderImpl<TPayload>;
};
