import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../domain/repositories/order.repository.interface';
import type { OrderRepository } from '../../domain/repositories/order.repository.interface';
import { PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository.interface';
import type { ProductRepository } from '../../../products/domain/repositories/product.repository.interface';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Injectable()
export class UpdateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    if (dto.clientName) {
      order.updateClientName(dto.clientName);
    }

    if (dto.items && dto.items.length > 0) {
      for (const oldItem of order.getItems()) {
        const product = await this.productRepository.findById(oldItem.getProductId());
        if (product) {
          await this.productRepository.save(product);
        }
      }

      const newOrderItems: OrderItem[] = [];
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

        newOrderItems.push(orderItem);
        await this.productRepository.save(product);
      }
      order.updateItems(newOrderItems);
    }
    return await this.orderRepository.save(order);
  }
}
