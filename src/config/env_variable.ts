import { required, optional, urlCheck, booleanCheck } from '@/lib/env_variable';

export class EnvVariable {
  private static cached: ReturnType<typeof EnvVariable.create> | null = null;

  private static create() {
    return {
      api: {
        discordWebhookUrl: urlCheck(required('DISCORD_WEBHOOK_URL')),
        slackWebhookUrl: urlCheck(
          optional(
            'SLACK_WEBHOOK_URL',
            'https://hooks.slack.com/services/your/default/webhook/url',
          ),
        ),
        githubWebhookSecret: required('GITHUB_WEBHOOK_SECRET'),
      },
      config: {
        mockAvailable: booleanCheck(required('MOCK_AVAILABLE')),
      },
      node: {
        state: process.env.NODE_ENV,
        development: process.env.NODE_ENV === 'development',
        test: process.env.NODE_ENV === 'test',
        production: process.env.NODE_ENV === 'production',
      },
    } as const;
  }

  static get() {
    if (!EnvVariable.cached) {
      EnvVariable.cached = EnvVariable.create();
    }
    return EnvVariable.cached;
  }

  static reset() {
    EnvVariable.cached = null;
  }
}
