import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../domain/repositories/order.repository.interface';
import type { OrderRepository } from '../../domain/repositories/order.repository.interface';
import { PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository.interface';
import type { ProductRepository } from '../../../products/domain/repositories/product.repository.interface';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.value-objects';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    const orderItems: OrderItem[] = [];

    for (const itemDto of dto.items) {
      const product = await this.productRepository.findById(itemDto.productId);
      
      if (!product) {
        throw new NotFoundException(`Product ${itemDto.productId} not found`);
      }

      const orderItem = OrderItem.create(
        product.id,
        product.getName(),
        product.getSKU(),
        product.getPrice(),
        itemDto.quantity
      );

      orderItems.push(orderItem);

      await this.productRepository.save(product);
    }

    const order = Order.create(
      Uuid.create().getValue(),
      dto.clientName,
      orderItems
    );

    return await this.orderRepository.save(order);
  }
}
