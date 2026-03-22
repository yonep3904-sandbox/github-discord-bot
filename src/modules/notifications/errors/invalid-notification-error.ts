import { NoticationError } from './notification-error';

export class InvalidNotificationError extends NoticationError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidNotificationError';
  }
}
