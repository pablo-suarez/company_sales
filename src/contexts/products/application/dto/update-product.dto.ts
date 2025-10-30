import { IsString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

}