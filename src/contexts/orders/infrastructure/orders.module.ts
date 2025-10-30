import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModel, OrderSchema } from './persistence/mongoose/order.schema';
import { MongoOrderRepository } from './persistence/mongoose/order.repository';
import { ORDER_REPOSITORY } from '../domain/repositories/order.repository.interface';
import { ProductsModule } from '../../products/infrastructure/products.module';
import { CreateOrderUseCase } from '../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../application/use-cases/get-order.use-case';
import { UpdateOrderUseCase } from '../application/use-cases/update-order.use-case';
import { GetTotalSoldLastMonthUseCase } from '../application/use-cases/get-total-sold-last-month.use-case';
import { GetHigherAmountOrderUseCase } from '../application/use-cases/get-higher-amount-order.use-case';
import { OrderController } from './controllers/order.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderModel.name, schema: OrderSchema },
    ]),
    ProductsModule,
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: MongoOrderRepository,
    },
    CreateOrderUseCase,
    GetOrderUseCase,
    UpdateOrderUseCase,
    GetTotalSoldLastMonthUseCase,
    GetHigherAmountOrderUseCase,
  ],
  exports: [ORDER_REPOSITORY],
})
export class OrdersModule {}
