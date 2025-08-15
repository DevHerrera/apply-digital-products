import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '@products/controllers';
import { ProductService } from '@products/services';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getHello: jest.fn(() => 'Hello World from Products!'), // arrow function
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductService>(ProductService);
  });

  it('should return hello', () => {
    const result = controller.getHello();
    expect(result).toBe('Hello World from Products!');
    expect(service.getHello).toHaveBeenCalledTimes(1); // ensures the mock fn was called
  });
});
