export abstract class BaseEntity {
  protected constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  public equals(entity: BaseEntity): boolean {
    return this.id === entity.id;
  }
}