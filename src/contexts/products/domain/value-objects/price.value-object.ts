export class Price {
  private constructor(private readonly value: number) {
    this.ensureIsValid(value);
  }

  public static create(value: number): Price {
    return new Price(value);
  }

  public getValue(): number {
    return this.value;
  }

  private ensureIsValid(value: number): void {
    if (value < 0) {
      throw new Error('The price cannot be negative');
    }
    if (!Number.isFinite(value)) {
      throw new TypeError('The price must be a valid number');
    }
    if (!this.hasValidDecimals(value)) {
      throw new Error('Price can have at most 2 decimal places');
    }
  }

  private hasValidDecimals(value: number): boolean {
    const decimals = (value.toString().split('.')[1] || '').length;
    return decimals <= 2;
  }

  public equals(other: Price): boolean {
    return this.value === other.value;
  }

  public add(other: Price): Price {
    return Price.create(this.value + other.value);
  }

  public multiply(quantity: number): Price {
    return Price.create(this.value * quantity);
  }

  public isGreaterThan(other: Price): boolean {
    return this.value > other.value;
  }

  public isLessThan(other: Price): boolean {
    return this.value < other.value;
  }
}