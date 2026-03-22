export class NoticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotificationError';
  }
}
