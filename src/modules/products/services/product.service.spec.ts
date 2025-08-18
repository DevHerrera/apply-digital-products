import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '@products/services';
import { ProductRepository } from '@products/repositories';
import { Product } from '@products/entities';
import { FindProductsFilterDto } from '@products/dtos';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repo: ProductRepository;
  let dataSource: DataSource;

  const mockProduct: Partial<Product> = {
    sku: 'SKU123',
    name: 'Test Product',
    brand: 'Brand A',
    model: 'Model X',
    category: 'Category 1',
    color: 'Black',
    price: 100,
    currency: 'USD',
    stock: 10,
    isActive: true,
  };

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [Product],
    });
    await dataSource.initialize();

    repo = new ProductRepository(dataSource);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: repo },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should create a product for testing', async () => {
    const product = repo.create(mockProduct as Product);
    await repo.save(product);

    const found = await repo.findOne({ where: { sku: 'SKU123' } });
    expect(found).toBeDefined();
    expect(found?.isActive).toBe(true);
  });

  describe('Soft delete product', () => {
    it('should delete (soft) an existing product', async () => {
      await service.softDeleteProduct('SKU123');

      const found = await repo.findOne({ where: { sku: 'SKU123' } });
      expect(found?.isActive).toBe(false);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      await expect(service.softDeleteProduct('INVALIDSKU')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Find by filters', () => {
    it('should return paginated products', async () => {
      const products = [
        repo.create({ ...mockProduct, sku: 'SKU1' }),
        repo.create({ ...mockProduct, sku: 'SKU2' }),
        repo.create({ ...mockProduct, sku: 'SKU3' }),
      ];
      await repo.save(products);

      const filters: FindProductsFilterDto = { page: 1, size: 2 };
      const result = await service.getProducts(filters);

      expect(result.data.length).toBeLessThanOrEqual(filters.size);
      expect(result.count).toBeGreaterThanOrEqual(result.data.length);
      expect(result.page).toBe(filters.page);
      expect(result.size).toBe(filters.size);
      expect(result.totalPages).toBe(Math.ceil(result.count / filters.size));
    });
  });
});
