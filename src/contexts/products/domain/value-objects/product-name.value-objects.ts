export class ProductName {
  private constructor(private readonly value: string) {
    this.ensureIsValid(value);
  }

  public static create(value: string): ProductName {
    return new ProductName(value);
  }

  public getValue(): string {
    return this.value;
  }

  private ensureIsValid(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (value.length > 100) {
      throw new Error('The product name cannot exceed 100 characters');
    }
    if (value.length < 3) {
      throw new Error('The product name must be at least 3 characters long');
    }
  }

  public equals(other: ProductName): boolean {
    return this.value === other.value;
  }
}