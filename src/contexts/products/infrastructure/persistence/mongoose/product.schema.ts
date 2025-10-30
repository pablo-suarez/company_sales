import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = ProductModel & Document;

@Schema({ collection: 'products', timestamps: true })
export class ProductModel {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: null })
  pictureUrl: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);

ProductSchema.index({ name: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ price: 1 });
