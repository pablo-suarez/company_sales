import { Quantity } from '../value-objects/quantity.value-object';

export class OrderItem {
  private constructor(
    private productId: string,
    private productName: string,
    private productSku: string,
    private price: number,
    private quantity: Quantity
  ) {}

  public static create(
    productId: string,
    productName: string,
    productSku: string,
    price: number,
    quantity: number
  ): OrderItem {
    if (price < 0) {
      throw new Error('Price cannot be negative');
    }

    return new OrderItem(
      productId,
      productName,
      productSku,
      price,
      Quantity.create(quantity)
    );
  }

  public getSubtotal(): number {
    return this.price * this.quantity.getValue();
  }

  public getProductId(): string {
    return this.productId;
  }

  public getQuantity(): number {
    return this.quantity.getValue();
  }

  public toPrimitives() {
    return {
      productId: this.productId,
      productName: this.productName,
      productSku: this.productSku,
      price: this.price,
      quantity: this.quantity.getValue(),
      subtotal: this.getSubtotal(),
    };
  }
}