import { ExternalApiError } from '@/errors';

export class DiscordApiError extends ExternalApiError {
  constructor(message: string, status: number) {
    super(message, status, 'discord');
    this.name = 'DiscordApiError';
  }
}
