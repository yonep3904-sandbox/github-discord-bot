import { required, urlCheck } from '@/lib/env_variable';

export const EnvConfig = {
  api: {
    discordWebhookUrl: urlCheck(required('DISCORD_WEBHOOK_URL')),
    githubWebhookSecret: required('GITHUB_WEBHOOK_SECRET'),
  },
  config: {},
  env: {
    state: process.env.NODE_ENV,
    development: process.env.NODE_ENV === 'development',
    test: process.env.NODE_ENV === 'test',
    production: process.env.NODE_ENV === 'production',
  },
} as const;
