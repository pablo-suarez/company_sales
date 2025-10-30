import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../domain/repositories/order.repository.interface';
import type { OrderRepository } from '../../domain/repositories/order.repository.interface';
import { Order } from '../../domain/entities/order.entity';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }
}