import { isError } from '@/utils/error';
import { RetryableError } from '@/errors/retryable.error';

export async function retry<T>(
  fn: () => Promise<T>,
  retries: number,
  interval: number,
  signal?: AbortSignal,
): Promise<T> {
  let attempt = 0;

  while (true) {
    if (signal?.aborted) {
      throw new Error('Retry aborted');
    }

    try {
      return await fn();
    } catch (err: unknown) {
      if (!isError(err, RetryableError)) {
        throw err;
      }

      attempt++;

      if (attempt > retries) {
        throw err;
      }

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(resolve, interval);

        signal?.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error('Retry aborted'));
        });
      });
    }
  }
}
