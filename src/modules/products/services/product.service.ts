import { Injectable } from '@nestjs/common';
import { FindProductsFilterDto } from '@products/dtos';
import { Product } from '@products/entities';
import { ProductRepository } from '@products/repositories';
import { PaginatedResponseDto } from '@shared/dtos/';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}
  getHello = (): string => {
    return 'Hello World from Products!';
  };

  async getProducts(
    filters: FindProductsFilterDto,
  ): Promise<PaginatedResponseDto<Product>> {
    const result = await this.productRepository.findByFilters(filters);
    const totalPages = Math.ceil(result.count / filters.size);

    return {
      data: result.data,
      count: result.count,
      page: filters.page,
      size: filters.size,
      totalPages,
    };
  }
}
