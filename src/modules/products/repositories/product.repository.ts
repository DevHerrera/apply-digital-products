import { DataSource, Repository } from 'typeorm';
import { Product } from '@products/entities';
import { Injectable } from '@nestjs/common';
import { IProduct } from '@products/interfaces';
import { FindProductsFilterDto } from '@products/dtos';
import {
  DeletedProductsReportResponseDto,
  ProductsReportFilterDto,
  ProductsReportResponseDto,
  ProductsByBrandResponseDto,
} from '@reports/dtos';

@Injectable()
export class ProductRepository extends Repository<Product> {
  private likeOperator: string;
  constructor(datasource: DataSource) {
    super(Product, datasource.createEntityManager());
    this.likeOperator = datasource.options.type === 'sqlite' ? 'LIKE' : 'ILIKE';
  }

  public async findOrSync(productData: IProduct): Promise<Product> {
    let product = await this.findOne({ where: { sku: productData.sku } });
    if (!product) {
      product = this.create(productData);
    } else {
      product = this.merge(product, productData);
    }
    await this.save(product);
    return product;
  }

  public async findByFilters(
    filters: FindProductsFilterDto,
  ): Promise<{ data: Product[]; count: number }> {
    const {
      sku,
      name,
      brand,
      model,
      category,
      color,
      minPrice,
      maxPrice,
      currency,
      minStock,
      maxStock,
      page,
      size,
    } = filters;

    const query = this.createQueryBuilder('product').where(
      'product.is_active = true',
    );

    if (sku !== undefined) {
      query.andWhere('product.sku = :sku', { sku });
    }

    if (name !== undefined) {
      query.andWhere(`product.name ${this.likeOperator} :name`, {
        name: `%${name}%`,
      });
    }

    if (brand !== undefined) {
      query.andWhere(`product.brand ${this.likeOperator} :brand`, {
        brand: `%${brand}%`,
      });
    }

    if (model !== undefined) {
      query.andWhere(`product.model ${this.likeOperator} :model`, {
        model: `%${model}%`,
      });
    }

    if (category !== undefined) {
      query.andWhere(`product.category ${this.likeOperator} :category`, {
        category: `%${category}%`,
      });
    }

    if (color !== undefined) {
      query.andWhere(`product.color ${this.likeOperator} :color`, {
        color: `%${color}%`,
      });
    }

    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (currency !== undefined) {
      query.andWhere('product.currency = :currency', { currency });
    }

    if (minStock !== undefined) {
      query.andWhere('product.stock >= :minStock', { minStock });
    }

    if (maxStock !== undefined) {
      query.andWhere('product.stock <= :maxStock', { maxStock });
    }

    // Pagination
    query.skip((page - 1) * size).take(size);

    query.orderBy('product.sku', 'ASC');

    const [data, count] = await query.getManyAndCount();

    return { data, count };
  }

  async getDeletedProductsReport(): Promise<DeletedProductsReportResponseDto> {
    const result = await this.createQueryBuilder('product')
      .select('COUNT(*)', 'totalProducts')
      .addSelect(
        'SUM(CASE WHEN product.isActive = false THEN 1 ELSE 0 END)',
        'totalDeletedProducts',
      )
      .addSelect(
        'ROUND(SUM(CASE WHEN product.isActive = false THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2)',
        'percentageDeletedProducts',
      )
      .getRawOne<{
        totalProducts: string;
        totalDeletedProducts: string;
        percentageDeletedProducts: string;
      }>();

    return {
      totalProducts: Number(result?.totalProducts),
      totalDeletedProducts: Number(result?.totalDeletedProducts),
      percentageDeletedProducts: result?.percentageDeletedProducts + '%',
    };
  }

  async getActiveProductsReport(
    filters: ProductsReportFilterDto,
  ): Promise<ProductsReportResponseDto> {
    const qb = this.createQueryBuilder('product');

    if (filters.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.startDate) {
      qb.andWhere('product.created_at >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      qb.andWhere('product.created_at <= :endDate', {
        endDate: filters.endDate,
      });
    }

    // Total products matching filters
    const productsMatched = await qb.getCount();

    // Total active products matching filters
    const activeProductsMatched = await qb
      .clone()
      .andWhere('product.isActive = true')
      .getCount();

    // Calculate percentage
    const percentageActive =
      productsMatched > 0
        ? ((activeProductsMatched / productsMatched) * 100).toFixed(2) + '%'
        : '0%';

    return { productsMatched, activeProductsMatched, percentageActive };
  }

  async getProductsTotalByBrand(): Promise<ProductsByBrandResponseDto[]> {
    const rows = await this.createQueryBuilder('product')
      .select('product.brand', 'brand')
      .addSelect('COUNT(*)', 'totalProducts')
      .groupBy('product.brand')
      .getRawMany<{ brand: string; totalProducts: string }>();

    return rows.map((row) => ({
      brand: row.brand,
      totalProducts: Number(row.totalProducts),
    }));
  }
}
