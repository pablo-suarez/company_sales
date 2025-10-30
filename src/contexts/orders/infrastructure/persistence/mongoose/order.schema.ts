import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class OrderItemSchema {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  productSku: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  subtotal: number;
}

export type OrderDocument = OrderModel & Document;

@Schema({ collection: 'orders', timestamps: true })
export class OrderModel {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  clientName: string;

  @Prop({ required: true, type: [OrderItemSchema] })
  items: OrderItemSchema[];

  @Prop({ required: true })
  total: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderModel);

OrderSchema.index({ clientName: 1 });
OrderSchema.index({ total: -1 });
OrderSchema.index({ createdAt: -1 });