/**
 * エラーオブジェクトに関するユーティリティ関数
 */

// エラーコンストラクタの型定義
type ErrorConstructor<T extends Error = Error> = new (...args: unknown[]) => T;

/**
 * オブジェクトの型ガード(Error)
 * @param error 判定対象のエラーオブジェクト
 */
export function isError(error: unknown): error is Error;

/**
 * エラーオブジェクトの型ガード(Error のサブクラス)
 * @param error 判定対象のエラーオブジェクト
 * @param ctor 判定対象のエラーコンストラクタ
 */
export function isError<T extends Error>(
  error: unknown,
  ctor: ErrorConstructor<T>,
): error is T;

export function isError<T extends Error>(
  error: unknown,
  ctor?: ErrorConstructor<T>,
): error is T {
  if (ctor) {
    return error instanceof ctor;
  }
  return error instanceof Error;
}

/**
 * エラーオブジェクトから名前を安全に取得するユーティリティ関数
 * ログ出力などでの利用を想定
 * @param error エラーオブジェクト
 * @returns エラーの名前、もしくはエラーでない場合の識別子文字列
 */
export function getErrorName(error: unknown): string {
  if (isError(error)) {
    return error.name ?? 'unknown error name';
  }
  return 'not an error';
}

/**
 * エラーオブジェクトからメッセージを安全に取得するユーティリティ関数
 * @param error エラーオブジェクト
 * @returns エラーのメッセージ、もしくはエラーでない場合の識別子文字列
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message ?? 'unknown error message';
  }
  return 'not an error';
}

/**
 * エラーオブジェクトからスタックトレースを安全に取得するユーティリティ関数
 * @param error エラーオブジェクト
 * @returns エラーのスタックトレース、もしくはエラーでない場合の識別子文字列
 */
export function getErrorStack(error: unknown): string {
  if (isError(error)) {
    return error.stack ?? 'unknown error stack';
  }
  return 'not an error';
}
