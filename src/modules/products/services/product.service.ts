import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@products/repositories';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}
  getHello = (): string => {
    return 'Hello World from Products!';
  };
}
