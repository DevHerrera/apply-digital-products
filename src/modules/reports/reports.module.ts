import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@products/entities';
import { ProductRepository } from '@products/repositories';
import { ProductReportService } from '@reports/services';
import { ReportsController } from '@reports/controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductRepository])],
  controllers: [ReportsController],
  providers: [ProductReportService, ProductRepository],
})
export class ReportsModule {}
