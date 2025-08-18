import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import {
  DeletedProductsReportResponseDto,
  ProductsByBrandResponseDto,
  ProductsReportFilterDto,
  ProductsReportResponseDto,
} from '@reports/dtos';
import { ProductReportService } from '@reports/services';

@Controller('reports')
export class ReportsController {
  constructor(private readonly productReportService: ProductReportService) {}

  @Get('products/brands')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: 'Total products grouped by brand',
    type: [ProductsByBrandResponseDto],
  })
  async getProductsTotalByBrand(): Promise<ProductsByBrandResponseDto[]> {
    return this.productReportService.getProductsTotalByBrand();
  }

  @Get('products/active')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description:
      'Report with total, deleted and percentage of deleted products',
    type: DeletedProductsReportResponseDto,
  })
  getProductsReport(
    @Query() filters: ProductsReportFilterDto,
  ): Promise<ProductsReportResponseDto> {
    return this.productReportService.getProductsReport(filters);
  }

  @Get('products/deleted-products')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description:
      'Report with total, deleted and percentage of deleted products',
    type: DeletedProductsReportResponseDto,
  })
  getDeletedProductsReport(): Promise<DeletedProductsReportResponseDto> {
    return this.productReportService.getDeletedProductsReport();
  }
}
