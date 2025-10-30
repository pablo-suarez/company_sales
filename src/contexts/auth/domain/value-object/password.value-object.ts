import * as bcrypt from 'bcrypt';

export class Password {
  private constructor(private readonly value: string) {}


  public static create(plainPassword: string): Password {
    this.ensureIsValid(plainPassword);
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);
    return new Password(hashedPassword);
  }

  public static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  public getValue(): string {
    return this.value;
  }

  public async compare(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.value);
  }

  private static ensureIsValid(password: string): void {
    if (!password || password.trim().length === 0) {
      throw new Error('Password cannot be empty');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener mínimo 6 carácteres');
    }

    if (password.length > 50) {
      throw new Error('La contraseña no puede exceder los 50 carácteres');
    }
  }
}