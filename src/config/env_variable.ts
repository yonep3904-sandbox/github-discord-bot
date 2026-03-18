import { required, urlCheck } from '@/lib/env_variable';

let cached: ReturnType<typeof createEnvConfig> | null = null;

const createEnvConfig = () =>
  ({
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
  }) as const;

export const getEnvConfig = () => {
  if (!cached) {
    cached = createEnvConfig();
  }
  return cached;
};
