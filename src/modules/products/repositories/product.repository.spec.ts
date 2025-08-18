import { DataSource } from 'typeorm';
import { ProductRepository } from '@products/repositories';
import { Product } from '@products/entities';
import { IProduct } from '@products/interfaces';
import { FindProductsFilterDto } from '@products/dtos';

describe('ProductRepository', () => {
  let repo: ProductRepository;
  let dataSource: DataSource;

  const baseProduct: IProduct = {
    sku: 'SKU1',
    name: 'Test Product',
    brand: 'BrandA',
    model: 'ModelX',
    category: 'Category1',
    color: 'Black',
    price: 150,
    currency: 'USD',
    stock: 10,
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

    // Seed multiple products
    const products: IProduct[] = [
      baseProduct,
      { ...baseProduct, sku: 'SKU2', price: 300, stock: 20, color: 'White' },
      {
        ...baseProduct,
        sku: 'SKU3',
        name: 'Another Product',
        brand: 'BrandB',
        stock: 5,
      },
    ];
    await repo.save(products);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('Find by filters', () => {
    it('should create a new product if it does not exist', async () => {
      const newProduct: IProduct = {
        ...baseProduct,
        sku: 'SKU_NEW',
        name: 'New Product',
      };
      const result = await repo.findOrSync(newProduct);

      expect(result.sku).toBe('SKU_NEW');
      expect(result.name).toBe('New Product');

      const found = await repo.findOne({ where: { sku: 'SKU_NEW' } });
      expect(found).not.toBeNull();
      expect(found?.name).toBe('New Product');
    });

    it('should update an existing product', async () => {
      const updatedProduct: IProduct = {
        ...baseProduct,
        name: 'Updated Name',
        sku: 'SKU1', // existing SKU
      };
      const result = await repo.findOrSync(updatedProduct);

      expect(result.name).toBe('Updated Name');

      const found = await repo.findOne({ where: { sku: 'SKU1' } });
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Updated Name');
    });
  });

  describe('Find or async', () => {
    it('should create a new product if it does not exist', async () => {
      const newProduct: IProduct = {
        ...baseProduct,
        sku: 'SKU_NEW',
        name: 'New Product',
      };
      const result = await repo.findOrSync(newProduct);

      expect(result.sku).toBe('SKU_NEW');
      expect(result.name).toBe('New Product');

      const found = await repo.findOne({ where: { sku: 'SKU_NEW' } });
      expect(found).not.toBeNull();
      expect(found?.name).toBe('New Product');
    });

    it('should update an existing product', async () => {
      const updatedProduct: IProduct = {
        ...baseProduct,
        name: 'Updated Name',
        sku: 'SKU1', // existing SKU
      };
      const result = await repo.findOrSync(updatedProduct);

      expect(result.name).toBe('Updated Name');

      const found = await repo.findOne({ where: { sku: 'SKU1' } });
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Updated Name');
    });
  });
});
