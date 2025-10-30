import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchProductsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @Transform(({ value }) => Number.parseFloat(value))
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => Number.parseFloat(value))
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  minStock?: number;

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  maxStock?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'price' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
