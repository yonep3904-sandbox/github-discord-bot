export type InboundBaseConfig = {
  id: string;
};

export type InboundGithubConfig = InboundBaseConfig & {
  secret: string;
};

// export type InboundCommonConfig =

export type OutboundBaseConfig = {
  id: string;
};

export type OutboundDiscordConfig = OutboundBaseConfig & {
  webhookUrl: string;
};

export type OutboundSlackConfig = OutboundBaseConfig & {
  webhookUrl: string;
};

export type ApiRequestConfig = {
  timeout: number;
  retry: {
    ratelimit: {
      count: number;
      interval: number;
    };
    others: {
      count: number;
      interval: number;
    };
  };
};
