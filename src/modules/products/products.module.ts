import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from '@products/controllers';
import { ProductService } from '@products/services';
import { Product } from '@products/entities';
import { ProductRepository } from '@products/repositories';
import { SyncProductsTask } from '@products/tasks';
import { ContentfulApiClient } from '@products/api-clients';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductRepository])],
  controllers: [ProductsController],
  providers: [
    ProductService,
    SyncProductsTask,
    ContentfulApiClient,
    ProductRepository,
  ],
})
export class ProductsModule {}
