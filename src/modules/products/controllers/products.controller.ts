import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { FindProductsFilterDto, ProductResponseDto } from '@products/dtos';
import { ProductService } from '@products/services';
import { PaginatedResponseDto } from '@shared/dtos';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @ApiExtraModels(PaginatedResponseDto, ProductResponseDto)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ProductResponseDto) },
            },
          },
        },
      ],
    },
  })
  @Get()
  findProducts(@Query() filters: FindProductsFilterDto) {
    return this.productService.getProducts(filters);
  }

  @ApiParam({
    name: 'sku',
    description: 'SKU of the product to delete',
    example: 'SKU12345',
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully soft-deleted',
    schema: {
      example: {
        message: 'Product with SKU SKU12345 has been deleted (soft).',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product not found',
        error: 'Not Found',
      },
    },
  })
  @Delete(':sku')
  async softDeleteProduct(@Param('sku') sku: string) {
    await this.productService.softDeleteProduct(sku);
    return { message: `Product with SKU ${sku} has been deleted (soft).` };
  }
}
