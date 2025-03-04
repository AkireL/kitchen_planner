export class KitchenAPIException extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = 'KitchenAPIException';
  }
}
