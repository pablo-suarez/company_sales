import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../../application/use-cases/get-order.use-case';
import { UpdateOrderUseCase } from '../../application/use-cases/update-order.use-case';
import { GetTotalSoldLastMonthUseCase } from '../../application/use-cases/get-total-sold-last-month.use-case';
import { GetHigherAmountOrderUseCase } from '../../application/use-cases/get-higher-amount-order.use-case';

import { CreateOrderDto } from '../../application/dto/create-order.dto';
import { UpdateOrderDto } from '../../application/dto/update-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly getTotalSoldLastMonthUseCase: GetTotalSoldLastMonthUseCase,
    private readonly getHigherAmountOrderUseCase: GetHigherAmountOrderUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.createOrderUseCase.execute(createOrderDto);
    return order.toPrimitives();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.getOrderUseCase.execute(id);
    return order.toPrimitives();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const order = await this.updateOrderUseCase.execute(id, updateOrderDto);
    return order.toPrimitives();
  }

  @Get('summary/total-sold-last-month')
  async getTotalSoldLastMonth() {
    const total = await this.getTotalSoldLastMonthUseCase.execute();
    return {
      totalSold: total,
      period: 'last_month',
    };
  }

  @Get('summary/higher-amount-order')
  async getHigherAmountOrder() {
    const order = await this.getHigherAmountOrderUseCase.execute();
    
    if (!order) {
      return {
        message: 'No completed orders found',
        order: null,
      };
    }

    return {
      order: order.toPrimitives(),
    };
  }
}