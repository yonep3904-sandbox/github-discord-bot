import { Injectable, Logger, Inject } from '@nestjs/common';

import { RetryableError } from '@/errors';
import type { DiscordNotificationPayload } from '@/types/external/discord';
import { DiscordApiError } from '../errors/';
import { getErrorStack } from '@/utils/error';
import type { NotificationSenderImpl } from '@/types/internal/notification-platform';
import {
  DISCORD_CONFIG,
  type DiscordConfig,
} from './discord-config-provider.service';

/**
 * DiscordNotificationSenderは、DiscordのWebhookにメッセージを送信するためのサービスクラスです。
 * このクラスは、Discord APIへのHTTPリクエストを管理し、エラーハンドリングやリトライロジックを実装しています。
 * 主な機能として、sendメソッドでメッセージを送信し、sendWithRetryメソッドでリトライロジックを提供します。
 * エラーが発生した場合は、DiscordApiErrorやRetryableErrorなどの適切なエラークラスをスローします。
 */
@Injectable()
export class DiscordNotificationSender implements NotificationSenderImpl<DiscordNotificationPayload> {
  private readonly logger = new Logger(DiscordNotificationSender.name);

  /**
   * コンストラクタ
   * @param webhookUrl DiscordのWebhook URL。
   * @param timeout HTTPリクエストのタイムアウト時間（ミリ秒）
   * @param rateLimitRetry 429 Too Many Requestsエラーが発生した場合のリトライ回数。
   */
  constructor(
    @Inject(DISCORD_CONFIG)
    private readonly config: DiscordConfig,
  ) {}

  /**
   * Discord webhookにメッセージを送信する。タイムアウトとステータスコードに応じたエラーハンドリングを行う。
   * 429 Too Many Requestsの場合は、Discordからの指示に従ってリトライする。その他のエラーコードに対しては適切なエラーをスローする。
   * @param payload 送信するDiscordWebhookPayloadオブジェクト
   * @returns Promise<void> メッセージの送信が成功した場合は解決し、失敗した場合はエラーをスローする
   * @throws {DiscordApiError} Discord APIからのエラー応答に対してスローされる。ステータスコードに応じたメッセージが含まれる。
   * @throws {RetryableError} 一時的なエラー（例: 429 Too Many Requestsや5xxサーバーエラableErrorー）に対してスローされる。リトライロジックで捕捉されることを想定している。
   * @throws {Error} その他の予期しないエラーに対してスローされる。
   */
  async send(payload: DiscordNotificationPayload): Promise<void> {
    // rate limit retry counter
    let remaining = this.config.retryCount;

    while (true) {
      // timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout,
      );
      try {
        // logging
        this.logger.debug(
          `Sending Discord webhook (attempt=${this.config.retryCount - remaining})`,
        );

        // fetch API call
        const response = await fetch(this.config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        // status code handling
        switch (response.status) {
          case 200:
          case 204:
            this.logger.debug('Discord webhook success');
            return;

          case 429: {
            // 429 Too Many Requests - rate limited
            if (remaining <= 0) {
              throw new RetryableError('Discord rate limit exceeded');
            }

            remaining--;

            const retryAfter =
              Number(response.headers.get('retry-after')) * 1000 ||
              this.config.retryInterval;

            this.logger.warn(
              `Discord rate limited. retry after ${retryAfter}s`,
            );

            await this.sleep(retryAfter);
            continue;
          }

          case 400:
            throw new DiscordApiError(
              'Discord webhook bad request',
              response.status,
            );

          case 401:
          case 403:
            throw new DiscordApiError(
              'Discord webhook authentication failed',
              response.status,
            );

          case 404:
            throw new DiscordApiError(
              'Discord webhook not found',
              response.status,
            );

          default:
            if (response.status >= 500) {
              throw new RetryableError(
                `Discord server error ${response.status}`,
              );
            }

            throw new DiscordApiError(
              `Unexpected status ${response.status}`,
              response.status,
            );
        }
      } catch (err: unknown) {
        this.logger.error('Discord webhook request failed', getErrorStack(err));

        if (err instanceof RetryableError || err instanceof DiscordApiError) {
          throw err;
        }

        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            this.logger.warn('Discord webhook request timed out');
          }
          throw new RetryableError(err.message, err);
        }

        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    }
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
