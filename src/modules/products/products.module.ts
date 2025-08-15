import { Module } from '@nestjs/common';
import { ProductsController } from 'src/modules/products/controllers';
import { ProductService } from 'src/modules/products/services';
@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductService],
})
export class ProductsModule {}
