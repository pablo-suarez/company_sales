import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderRepository } from '../../../domain/repositories/order.repository.interface';
import { Order } from '../../../domain/entities/order.entity';
import { OrderItem } from '../../../domain/entities/order-item.entity';
import { OrderDocument, OrderModel } from './order.schema';

@Injectable()
export class MongoOrderRepository implements OrderRepository {
  constructor(
    @InjectModel(OrderModel.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async save(order: Order): Promise<Order> {
    const primitives = order.toPrimitives();
    
    const existingOrder = await this.orderModel.findOne({ id: primitives.id });
    
    if (existingOrder) {
      await this.orderModel.updateOne(
        { id: primitives.id },
        { $set: primitives },
      );
    } else {
      await this.orderModel.create(primitives);
    }

    return order;
  }

  async findById(id: string): Promise<Order | null> {
    const doc = await this.orderModel.findOne({ id }).exec();
    
    if (!doc) {
      return null;
    }

    return this.toDomain(doc);
  }

  async findAll(): Promise<Order[]> {
    const docs = await this.orderModel.find().sort({ createdAt: -1 }).exec();
    return docs.map(doc => this.toDomain(doc));
  }

  async delete(id: string): Promise<void> {
    await this.orderModel.deleteOne({ id }).exec();
  }

  async getTotalSoldPriceLastMonth(): Promise<number> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const result = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalSold: { $sum: '$total' }
        }
      }
    ]);

    return result.length > 0 ? result[0].totalSold : 0;
  }

  async getHigherAmountOrder(): Promise<Order | null> {
    const doc = await this.orderModel
      .findOne()
      .sort({ total: -1 })
      .exec();

    if (!doc) {
      return null;
    }

    return this.toDomain(doc);
  }

  private toDomain(doc: OrderDocument): Order {
    const items = doc.items.map(item =>
      OrderItem.create(
        item.productId,
        item.productName,
        item.productSku,
        item.price,
        item.quantity
      )
    );

    return Order.reconstitute(
      doc.id,
      doc.clientName,
      items,
      doc.total,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}