import { Injectable, Inject } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../domain/repositories/order.repository.interface';
import type { OrderRepository } from '../../domain/repositories/order.repository.interface';
import { Order } from '../../domain/entities/order.entity';

@Injectable()
export class GetHigherAmountOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(): Promise<Order | null> {
    return await this.orderRepository.getHigherAmountOrder();
  }
}