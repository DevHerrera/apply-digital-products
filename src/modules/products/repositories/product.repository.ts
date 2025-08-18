import { DataSource, Repository } from 'typeorm';
import { Product } from '@products/entities';
import { Injectable } from '@nestjs/common';
import { IProduct } from '@products/interfaces';
import { FindProductsFilterDto } from '@products/dtos';

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

    const query = this.createQueryBuilder('product');

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
}
