import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@products/repositories';
import {
  DeletedProductsReportResponseDto,
  ProductsByBrandResponseDto,
  ProductsReportFilterDto,
  ProductsReportResponseDto,
} from '@reports/dtos';

@Injectable()
export class ProductReportService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getDeletedProductsReport(): Promise<DeletedProductsReportResponseDto> {
    return this.productRepository.getDeletedProductsReport();
  }

  async getProductsReport(
    filters: ProductsReportFilterDto,
  ): Promise<ProductsReportResponseDto> {
    return this.productRepository.getActiveProductsReport(filters);
  }

  async getProductsTotalByBrand(): Promise<ProductsByBrandResponseDto[]> {
    return this.productRepository.getProductsTotalByBrand();
  }
}
