import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '@products/services';
import { ProductRepository } from '@products/repositories';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            merge: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should return hello', () => {
    expect(service.getHello()).toBe('Hello World from Products!');
  });
});
