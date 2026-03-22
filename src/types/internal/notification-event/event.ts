import { GithubNotificationContent } from './github';
import { ManualNotificationContent } from './manual';

export type NotificationEvent =
  | {
      source: 'github';
      content: GithubNotificationContent;
    }
  | {
      source: 'manual';
      content: ManualNotificationContent;
    };

export type NotificationJob = {
  id: string;
  event: NotificationEvent;
};
