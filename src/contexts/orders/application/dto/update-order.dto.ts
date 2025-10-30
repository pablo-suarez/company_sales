import { IsString, IsArray, IsOptional, ValidateNested, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  clientName?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items?: UpdateOrderItemDto[];
}