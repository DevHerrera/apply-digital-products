import { Injectable, NotFoundException } from '@nestjs/common';
import { FindProductsFilterDto } from '@products/dtos';
import { Product } from '@products/entities';
import { ProductRepository } from '@products/repositories';
import { PaginatedResponseDto } from '@shared/dtos/';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async softDeleteProduct(sku: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { sku, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.update(sku, { isActive: false });
  }

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
