import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '@products/controllers';
import { ProductService } from '@products/services';
import { FindProductsFilterDto, ProductResponseDto } from '@products/dtos';
import { PaginatedResponseDto } from '@shared/dtos';

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
            getProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return paginated products', async () => {
    const mockProducts: ProductResponseDto[] = [
      {
        sku: 'SKU123',
        name: 'Product A',
        brand: 'Brand A',
        model: 'Model A',
        category: 'Category A',
        color: 'Black',
        price: 100,
        currency: 'USD',
        stock: 10,
        isActive: true,
      },
      {
        sku: 'SKU456',
        name: 'Product B',
        brand: 'Brand B',
        model: 'Model B',
        category: 'Category B',
        color: 'White',
        price: 200,
        currency: 'USD',
        stock: 5,
        isActive: true,
      },
    ];

    const filters: FindProductsFilterDto = { page: 1, size: 10 };
    const mockResponse = {
      data: mockProducts,
      count: mockProducts.length,
      page: filters.page,
      size: filters.size,
      totalPages: 2,
    } as PaginatedResponseDto<ProductResponseDto>;

    (service.getProducts as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.findProducts(filters);

    expect(result).toEqual(mockResponse);
    expect(service['getProducts']).toHaveBeenCalledWith(filters);
    expect(service['getProducts']).toHaveBeenCalledTimes(1);
  });

  it('should return empty paginated response when no products match', async () => {
    const filters: FindProductsFilterDto = { page: 1, size: 10 };
    const mockResponse = {
      data: [],
      count: 0,
      page: filters.page,
      size: filters.size,
      totalPages: 0,
    } as PaginatedResponseDto<ProductResponseDto>;

    (service.getProducts as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.findProducts(filters);

    expect(result).toEqual(mockResponse);
    expect(service['getProducts']).toHaveBeenCalledWith(filters);
    expect(service['getProducts']).toHaveBeenCalledTimes(1);
  });
});
