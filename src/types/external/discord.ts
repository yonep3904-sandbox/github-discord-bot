/**
 * Discord Webhook messages 通信で利用する型定義
 * 参考: https://docs.discord.com/developers/resources/webhook
 */
import type { ISO8601 } from '@/types/utility/scalars';

export type DiscordColor = number; // 16進数カラーコード (例: 0xff0000)

export type EmbedFooter = {
  text: string; // フッターテキスト
  icon_url?: string; // フッターアイコンのURL (小さな画像がテキストの左側に表示される)
};

export type EmbedImage = {
  url: string; // 画像のURL
};

export type EmbedAuthor = {
  name?: string; // 著者名
  url?: string; // 著者名をクリックしたときのURL
  icon_url?: string; // 著者のアイコン画像URL
};

export type EmbedField = {
  name: string; // フィールドのタイトル
  value: string; // フィールドの内容(Markdown対応)
  inline?: boolean; // trueの場合、フィールドを横並びに表示
};

export type Embed = {
  title?: string; // タイトル
  description?: string; // 説明(Markdown対応)
  url?: string; // タイトルをクリックしたときのURL
  timestamp?: ISO8601; // ISO8601形式の日時文字列
  color?: DiscordColor; // カラーコード
  footer?: EmbedFooter; // フッター
  image?: EmbedImage; // 埋め込み画像(下部に表示)
  thumbnail?: EmbedImage; // サムネイル画像(右上に表示)
  author?: EmbedAuthor; // 著者情報(タイトルの上に表示)
  fields?: EmbedField[]; // フィールド(タイトルと値のペア、25個まで)
};

export type DiscordWebhookMessage = {
  content?: string; // メッセージの内容(2000文字まで)
  embeds?: Embed[]; // 埋め込みメッセージ(10個まで)
  username?: string; // botの表示名を上書き
  avatar_url?: string; // botのアイコンURLを上書き
  tts?: boolean; // trueの場合、メッセージをテキスト読み上げする
};
