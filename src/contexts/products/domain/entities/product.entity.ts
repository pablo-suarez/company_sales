import { BaseEntity } from '../../../../shared/domain/entities/base.entity';
import { ProductName } from '../value-objects/product-name.value-objects';
import { Price } from '../value-objects/price.value-object';
import { SKU } from '../value-objects/sku.value-objects';

export class Product extends BaseEntity {
  private constructor(
    id: string,
    private name: ProductName,
    private sku: SKU,
    private price: Price,
    private pictureUrl: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }
  public static create(
    id: string,
    name: string,
    sku: string,
    price: number,
    pictureUrl?: string,
  ): Product {
    return new Product(
      id,
      ProductName.create(name),
      SKU.create(sku),
      Price.create(price),
      pictureUrl || null,
      new Date(),
      new Date(),
    );
  }
  public static reconstitute(
    id: string,
    name: string,
    sku: string,
    price: number,
    pictureUrl: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): Product {
    return new Product(
      id,
      ProductName.create(name),
      SKU.create(sku),
      Price.create(price),
      pictureUrl,
      createdAt,
      updatedAt,
    );
  }

  public updateName(name: string): void {
    this.name = ProductName.create(name);
    this.updatedAt = new Date();
  }

  public updatePrice(price: number): void {
    this.price = Price.create(price);
    this.updatedAt = new Date();
  }

  public updatePicture(pictureUrl: string): void {
    this.pictureUrl = pictureUrl;
    this.updatedAt = new Date();
  }

  public getName(): string {
    return this.name.getValue();
  }

  public getSKU(): string {
    return this.sku.getValue();
  }

  public getPrice(): number {
    return this.price.getValue();
  }

  public getPictureUrl(): string | null {
    return this.pictureUrl;
  }

  public toPrimitives() {
    return {
      id: this.id,
      name: this.name.getValue(),
      sku: this.sku.getValue(),
      price: this.price.getValue(),
      pictureUrl: this.pictureUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
