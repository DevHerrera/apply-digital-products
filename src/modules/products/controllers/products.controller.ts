import { Controller, Get } from '@nestjs/common';
import { ProductService } from '@products/services';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getHello(): string {
    return this.productService.getHello();
  }
}
