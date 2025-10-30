export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchProductsResponseDto<T = any> {
  data: T[];
  pagination: PaginationDto;
}
