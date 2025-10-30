import { BaseEntity } from '../../../../shared/domain/entities/base.entity';
import { Email } from '../../../../shared/domain/value-objects/email.value-objects';
import { Password } from '../value-object/password.value-object';


export class User extends BaseEntity {
  private constructor(
    id: string,
    private email: Email,
    private password: Password,
    private name: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  public static create(
    id: string,
    email: string,
    password: string,
    name: string,
  ): User {
    return new User(
      id,
      Email.create(email),
      Password.create(password),
      name,
      new Date(),
      new Date()
    );
  }

  public static reconstitute(
    id: string,
    email: string,
    hashedPassword: string,
    name: string,
    createdAt: Date,
    updatedAt: Date
  ): User {
    return new User(
      id,
      Email.create(email),
      Password.fromHash(hashedPassword),
      name,
      createdAt,
      updatedAt
    );
  }

  public async verifyPassword(plainPassword: string): Promise<boolean> {
    return await this.password.compare(plainPassword);
  }

  public getEmail(): string {
    return this.email.getValue();
  }

  public getName(): string {
    return this.name;
  }

  public getHashedPassword(): string {
    return this.password.getValue();
  }


  public toPrimitives() {
    return {
      id: this.id,
      email: this.email.getValue(),
      password: this.password.getValue(),
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
