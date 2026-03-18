import type { DiscordColor } from '@/types/external/discord';

/**
 * "#RRGGBB"または"RRGGBB"形式の16進数カラーコードをDiscordのカラーコード（整数）に変換する関数
 * @param hex 16進数カラーコード（例: "#FF5733" または "FF5733"）
 * @returns DiscordColor
 */
export function toDiscordColor(hex: string): DiscordColor;

/**
 * RGB値をDiscordのカラーコード（整数）に変換する関数
 * @param r 赤の値（0-255）
 * @param g 緑の値（0-255）
 * @param b 青の値（0-255）
 * @returns DiscordColor
 */
export function toDiscordColor(r: number, g: number, b: number): DiscordColor;

export function toDiscordColor(
  arg1: string | number,
  arg2?: number,
  arg3?: number,
): DiscordColor {
  if (typeof arg1 === 'string') {
    // "#RRGGBB"または"RRGGBB"形式の16進数カラーコードを処理
    const hex = arg1;
    if (!/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
      throw new Error(
        'Invalid hex color format. Expected "#RRGGBB" or "RRGGBB".',
      );
    }
    return parseInt(hex, 16);
  } else if (
    typeof arg1 === 'number' &&
    typeof arg2 === 'number' &&
    typeof arg3 === 'number'
  ) {
    // RGB値を処理
    const [r, g, b] = [arg1, arg2, arg3];
    const isValidRGB = (v: number) => v >= 0 && v <= 255;
    if ([r, g, b].some((v) => !isValidRGB(v))) {
      throw new Error('RGB values must be in the range 0-255.');
    }
    return (r << 16) | (g << 8) | b;
  } else {
    throw new Error(
      'Invalid arguments. Expected either a hex string or three RGB numbers.',
    );
  }
}
