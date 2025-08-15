import { DataSource, Repository } from 'typeorm';
import { Product } from '@products/entities';
import { Injectable } from '@nestjs/common';
import { IProduct } from '@products/interfaces';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(datasource: DataSource) {
    super(Product, datasource.createEntityManager());
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
}
