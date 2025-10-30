export class SKU {
  private constructor(private readonly value: string) {
    this.ensureIsValid(value);
  }

  public static create(value: string): SKU {
    return new SKU(value.toUpperCase().trim());
  }

  public getValue(): string {
    return this.value;
  }

  private ensureIsValid(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('SKU cannot be empty');
    }
    
    if (value.length < 3) {
      throw new Error('SKU must be at least 3 characters long');
    }
    
    if (value.length > 50) {
      throw new Error('SKU cannot exceed 50 characters');
    }
    
    const skuRegex = /^[A-Z0-9-]+$/;
    if (!skuRegex.test(value.toUpperCase())) {
      throw new Error('SKU can only contain uppercase letters, numbers, and hyphens');
    }
  }

  public equals(other: SKU): boolean {
    return this.value === other.value;
  }
}