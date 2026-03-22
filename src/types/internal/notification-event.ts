export type NotificationEvent =
  | {
      source: 'github';
      type: 'pull_request.opened';
      repository: string;
      actor: string;
      title: string;
      url: string;
    }
  | {
      source: 'manual';
      type: 'custom';
      title: string;
      message: string;
      level: 'info' | 'warn' | 'error';
    };

export type NotificationJob = {
  id: string;
  event: NotificationEvent;
};
