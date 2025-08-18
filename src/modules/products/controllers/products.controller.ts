import { Controller, Get, Query } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
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
}
