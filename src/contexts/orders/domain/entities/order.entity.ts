import { BaseEntity } from '../../../../shared/domain/entities/base.entity';
import { OrderItem } from './order-item.entity';

export class Order extends BaseEntity {
  private constructor(
    id: string,
    private clientName: string,
    private items: OrderItem[],
    private total: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  public static create(
    id: string,
    clientName: string,
    items: OrderItem[]
  ): Order {
    if (!clientName || clientName.trim().length === 0) {
      throw new Error('Client name cannot be empty');
    }

    if (items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    const total = items.reduce((sum, item) => sum + item.getSubtotal(), 0);

    return new Order(
      id,
      clientName,
      items,
      total,
      new Date(),
      new Date()
    );
  }

  public static reconstitute(
    id: string,
    clientName: string,
    items: OrderItem[],
    total: number,
    createdAt: Date,
    updatedAt: Date
  ): Order {
    return new Order(
      id,
      clientName,
      items,
      total,
      createdAt,
      updatedAt
    );
  }

  public updateClientName(clientName: string): void {
    if (!clientName || clientName.trim().length === 0) {
      throw new Error('Client name cannot be empty');
    }
    this.clientName = clientName;
    this.updatedAt = new Date();
  }

  public updateItems(items: OrderItem[]): void {
    if (items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    this.items = items;
    this.total = items.reduce((sum, item) => sum + item.getSubtotal(), 0);
    this.updatedAt = new Date();
  }

  public getClientName(): string {
    return this.clientName;
  }

  public getItems(): OrderItem[] {
    return this.items;
  }

  public getTotal(): number {
    return this.total;
  }

  public toPrimitives() {
    return {
      id: this.id,
      clientName: this.clientName,
      items: this.items.map(item => item.toPrimitives()),
      total: this.total,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}