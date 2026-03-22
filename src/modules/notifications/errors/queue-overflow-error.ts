import { NoticationError } from './notification-error';

export class QueueOverflowError extends NoticationError {
  constructor(message: string) {
    super(message);
    this.name = 'QueueOverflowError';
  }
}
