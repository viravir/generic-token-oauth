export class InvalidOptionsError extends Error {
  public name = 'InvalidOptionsError';
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
