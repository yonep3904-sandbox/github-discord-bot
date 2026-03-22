export class ExternalApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly service: string, // どの外部サービスか識別
  ) {
    super(message);
    this.name = 'ExternalApiError';
  }
}
