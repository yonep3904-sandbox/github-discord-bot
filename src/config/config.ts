import { getEnvConfig } from './env_variable';

let cached: ReturnType<typeof createConfig> | null = null;

export const createConfig = () =>
  ({
    api: {
      ...getEnvConfig().api,
    },
    config: {
      ...getEnvConfig().config,
    },
    env: {
      ...getEnvConfig().env,
    },
  }) as const;

export const getConfig = () => {
  if (!cached) {
    cached = createConfig();
  }
  return cached;
};
