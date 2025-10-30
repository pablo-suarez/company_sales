import { v4 as uuidv4, validate } from 'uuid';

export class Uuid {
  private constructor(private readonly value: string) {
    this.ensureIsValid(value);
  }

  public static create(): Uuid {
    return new Uuid(uuidv4());
  }

  public static fromString(value: string): Uuid {
    return new Uuid(value);
  }

  public getValue(): string {
    return this.value;
  }

  private ensureIsValid(value: string): void {
    if (!validate(value)) {
      throw new Error(`UUID no válido: ${value}`);
    }
  }

  public equals(other: Uuid): boolean {
    return this.value === other.value;
  }
}