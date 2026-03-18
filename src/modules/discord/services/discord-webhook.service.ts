import { Injectable, Logger } from '@nestjs/common';

import { Config } from '@/config/config';
import { RetryableError } from '@/common/errors/retryable.error';
import type { DiscordWebhookMessage } from '@/types/external/discord';
import { DiscordApiError } from '../errors/discord-api-error';

/**
 * DiscordWebhookServiceは、DiscordのWebhookにメッセージを送信するためのサービスクラスです。
 * このクラスは、Discord APIへのHTTPリクエストを管理し、エラーハンドリングやリトライロジックを実装しています。
 * 主な機能として、sendメソッドでメッセージを送信し、sendWithRetryメソッドでリトライロジックを提供します。
 * エラーが発生した場合は、DiscordApiErrorやRetryableErrorなどの適切なエラークラスをスローします。
 */
@Injectable()
export class DiscordWebhookService {
  private readonly logger = new Logger(DiscordWebhookService.name);

  /**
   * Discord webhookにメッセージを送信する。タイムアウトとステータスコードに応じたエラーハンドリングを行う。
   * 429 Too Many Requestsの場合は、Discordからの指示に従ってリトライする。その他のエラーコードに対しては適切なエラーをスローする。
   * @param message 送信するDiscordWebhookMessageオブジェクト
   * @param timeout タイムアウト時間（ミリ秒）。デフォルトは5000ms（5秒）
   * @param rateLimitRetry 429 Too Many Requestsに対するリトライ回数。デフォルトは3回
   * @returns Promise<void> メッセージの送信が成功した場合は解決し、失敗した場合はエラーをスローする
   * @throws {DiscordApiError} Discord APIからのエラー応答に対してスローされる。ステータスコードに応じたメッセージが含まれる。
   * @throws {RetryableError} 一時的なエラー（例: 429 Too Many Requestsや5xxサーバーエラー）に対してスローされる。リトライロジックで捕捉されることを想定している。
   * @throws {Error} その他の予期しないエラーに対してスローされる。
   */
  async send(
    message: DiscordWebhookMessage,
    timeout: number = 5000,
    rateLimitRetry: number = 3,
  ): Promise<void> {
    // timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      this.logger.debug('Sending Discord webhook message');

      // fetch API call
      const response = await fetch(Config.api.discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
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
          if (rateLimitRetry <= 0) {
            throw new RetryableError('Discord rate limit exceeded');
          }

          const retryAfter = Number(response.headers.get('retry-after')) || 1;

          this.logger.warn(`Discord rate limited. retry after ${retryAfter}s`);

          await new Promise((r) => setTimeout(r, retryAfter * 1000));
          return this.send(message, timeout, rateLimitRetry - 1);
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
            throw new RetryableError(`Discord server error ${response.status}`);
          }

          throw new DiscordApiError(
            `Unexpected status ${response.status}`,
            response.status,
          );
      }
    } catch (err) {
      this.logger.error(
        'Discord webhook request failed',
        err instanceof Error ? err.stack : undefined,
      );
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Discord webhookにメッセージを送信する際のリトライロジックを実装する。sendメソッドでRetryableErrorがスローされた場合に、指定された回数だけリトライを行う。
   * @param message 送信するDiscordWebhookMessageオブジェクト
   * @param retries リトライ回数。デフォルトは3回
   * @param interval リトライの間隔（ミリ秒）。デフォルトは1000ms（1秒）
   * @returns Promise<void> メッセージの送信が成功した場合は解決し、失敗した場合はエラーをスローする
   * @throws {DiscordApiError} Discord APIからのエラー応答に対してスローされる。ステータスコードに応じたメッセージが含まれる。
   * @throws {RetryableError} 一時的なエラー（例: 429 Too Many Requestsや5xxサーバーエラー）に対してスローされる。リトライロジックで捕捉されることを想定している。
   * @throws {Error} その他の予期しないエラーに対してスローされる。
   */
  async sendWithRetry(
    message: DiscordWebhookMessage,
    retries: number = 3,
    interval: number = 1000,
  ): Promise<void> {
    let attempt = 0;

    while (true) {
      try {
        await this.send(message);
        return;
      } catch (err) {
        if (!(err instanceof RetryableError)) {
          throw err;
        }

        attempt++;

        if (attempt > retries) {
          this.logger.error(`Discord webhook failed after retries`);
          throw err;
        }

        this.logger.warn(`Retry attempt ${attempt}/${retries}`);

        await new Promise((r) => setTimeout(r, interval));
      }
    }
  }
}
