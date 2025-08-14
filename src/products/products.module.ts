import { Module } from '@nestjs/common';
import { ProductsController } from '@products/controllers';
import { ProductService } from '@products/services';
@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductService],
})
export class ProductsModule {}
