import { EnvConfig } from './env_variable';

export const Config = {
  api: {
    ...EnvConfig.api,
  },
  config: {
    ...EnvConfig.config,
  },
  env: {
    ...EnvConfig.env,
  },
} as const;
