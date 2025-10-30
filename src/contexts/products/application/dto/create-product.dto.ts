import { IsString, IsNumber, IsNotEmpty, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku: string;

  @IsNumber()
  @Min(0)
  price: number;

}