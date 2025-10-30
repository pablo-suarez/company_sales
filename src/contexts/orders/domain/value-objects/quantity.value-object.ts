export class Quantity {
  private constructor(private readonly value: number) {
    this.ensureIsValid(value);
  }

  public static create(value: number): Quantity {
    return new Quantity(value);
  }

  public getValue(): number {
    return this.value;
  }

  private ensureIsValid(value: number): void {
    if (value <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (!Number.isInteger(value)) {
      throw new TypeError('Quantity must be an integer');
    }
  }
}