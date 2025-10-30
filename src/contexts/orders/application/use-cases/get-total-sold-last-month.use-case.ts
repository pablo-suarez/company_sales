import { Injectable, Inject } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../domain/repositories/order.repository.interface';
import type { OrderRepository } from '../../domain/repositories/order.repository.interface';


@Injectable()
export class GetTotalSoldLastMonthUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(): Promise<number> {
    return await this.orderRepository.getTotalSoldPriceLastMonth();
  }
}