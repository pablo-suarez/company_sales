import { Injectable, Inject } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import type { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { SearchProductsDto } from '../dto/search-products.dto';
import { SearchProductsResponseDto } from '../dto/search-products-response.dto';

@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(dto: SearchProductsDto): Promise<SearchProductsResponseDto> {
    const filters = {
      name: dto.name,
      sku: dto.sku,
      minPrice: dto.minPrice,
      maxPrice: dto.maxPrice,
    };

    const options = {
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
      page: dto.page,
      limit: dto.limit,
    };

    const { products, total } = await this.productRepository.search(filters, options);

    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      data: products.map(product => product.toPrimitives()),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}