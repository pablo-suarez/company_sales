import { BaseRepository } from '../../../../shared/domain/repositories/base.repository.interface';
import { Product } from '../entities/product.entity';

export interface SearchFilters {
  name?: string;
  sku?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface SearchOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: Product[];
  total: number;
}

export interface ProductRepository extends BaseRepository<Product> {
  findByName(name: string): Promise<Product | null>;
  findBySKU(sku: string): Promise<Product | null>;
  search(filters: SearchFilters, options: SearchOptions): Promise<SearchResult>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';