import { Provider } from '@nestjs/common';
import { Config } from '@/config/config';

export const DISCORD_CONFIG = Symbol('DISCORD_CONFIG');

export type DiscordConfig = {
  id: string;
  webhookUrl: string;
  timeout: number;
  retryCount: number; // 429: ratelimit
  retryInterval: number;
};

export const DiscordConfigProvider: Provider = {
  provide: DISCORD_CONFIG,
  useFactory: () => {
    const config = Config.get();
    const discord = config.outbound.discord;
    const api = config.apiRequest;

    return {
      id: discord.id,
      webhookUrl: discord.webhookUrl,
      retryCount: api.retry.ratelimit.count,
      retryInterval: api.retry.ratelimit.interval,
      timeout: api.timeout,
    } satisfies DiscordConfig;
  },
};
