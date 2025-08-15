import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  public getHello(): string {
    return 'Hello World from Products!';
  }
}
