export class Email {
  private constructor(private readonly value: string) {
    this.ensureIsValid(value);
  }

  public static create(value: string): Email {
    return new Email(value);
  }

  public getValue(): string {
    return this.value;
  }

  private ensureIsValid(value: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error(`Email no válido: ${value}`);
    }
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}
