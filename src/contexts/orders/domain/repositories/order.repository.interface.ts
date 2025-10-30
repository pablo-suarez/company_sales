import { BaseRepository } from '../../../../shared/domain/repositories/base.repository.interface';
import { Order } from '../entities/order.entity';

export interface OrderRepository extends BaseRepository<Order> {
  getTotalSoldPriceLastMonth(): Promise<number>;
  getHigherAmountOrder(): Promise<Order | null>;
}

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';