import { DataSource } from 'typeorm';
import { ProductRepository } from '@products/repositories';
import { Product } from '@products/entities';
import { IProduct } from '@products/interfaces';

describe('ProductRepository', () => {
  let repo: ProductRepository;
  let dataSource: DataSource;

  const mockData: IProduct = {
    brand: 'Test Brand',
    category: 'Test Category',
    sku: '123',
    color: 'Test Color',
    currency: 'USD',
    isActive: true,
    model: 'Test Model',
    stock: 10,
    name: 'Test Product',
    price: 100,
  };

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [Product],
      synchronize: true,
    });
    await dataSource.initialize();
    repo = new ProductRepository(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should create a new product if not exists', async () => {
    const product = await repo.findOrSync(mockData);
    expect(product.sku).toBe('123');

    const found = await repo.findOne({ where: { sku: '123' } });
    expect(found).not.toBeNull();
  });

  it('should update an existing product', async () => {
    const product = await repo.findOrSync({
      ...mockData,
      name: 'Updated Product',
    });
    expect(product.name).toBe('Updated Product');
  });
});
