import { EnvVariable } from './env_variable';
import type {
  InboundGithubConfig,
  OutboundDiscordConfig,
  OutboundSlackConfig,
  ApiRequestConfig,
} from '@/types/internal/config';
export class Config {
  private static cached: ReturnType<typeof Config.create> | null = null;

  private static create() {
    // Load environment variables
    const env = EnvVariable.get();

    // Mock is only for testing and development
    const mockAvailable = env.config.mockAvailable;
    if (mockAvailable && env.node.production) {
      throw new Error('Mock cannot be enabled in production');
    }

    // API request configurations
    const apiRequest: ApiRequestConfig = {
      timeout: 5000,
      retry: {
        // 429 Too Many Requests
        ratelimit: {
          count: 5,
          interval: 1000,
        },
        // 5xx Server Errors and network errors
        others: {
          count: 5,
          interval: 3000,
        },
      },
    };

    // Inbound and outbound configurations
    const inbound: {
      github: InboundGithubConfig;
    } = {
      github: {
        id: 'github-inbound',
        secret: env.api.githubWebhookSecret,
      },
    };

    const outbound: {
      discord: OutboundDiscordConfig;
      slack: OutboundSlackConfig;
    } = {
      discord: {
        id: 'discord-outbound',
        webhookUrl: env.api.discordWebhookUrl,
      },
      slack: {
        id: 'slack-outbound',
        webhookUrl: env.api.slackWebhookUrl,
      },
    };

    return {
      apiRequest: apiRequest,
      inbound: inbound,
      outbound: outbound,
      mock: {
        available: mockAvailable,
      },
      node: {
        ...env.node,
      },
    } as const;
  }

  static get() {
    if (!Config.cached) {
      Config.cached = Config.create();
    }
    return Config.cached;
  }

  static reset() {
    Config.cached = null;
  }
}
