import { DataSource } from 'typeorm';
import { ProductRepository } from '@products/repositories';
import { Product } from '@products/entities';
import { IProduct } from '@products/interfaces';
import { FindProductsFilterDto } from '@products/dtos';

describe('ProductRepository - findByFilters', () => {
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
    isActive: true,
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

  it('should return all products with no filters', async () => {
    const filters: FindProductsFilterDto = { page: 1, size: 5 };
    const result = await repo.findByFilters(filters);

    expect(result.count).toBeGreaterThanOrEqual(3);
    expect(result.data.length).toBe(3);
  });

  it('should filter by SKU', async () => {
    const filters: FindProductsFilterDto = { sku: 'SKU2', page: 1, size: 5 };
    const result = await repo.findByFilters(filters);

    expect(result.data.length).toBe(1);
    expect(result.data[0].sku).toBe('SKU2');
  });

  it('should filter by name (ILIKE)', async () => {
    const filters: FindProductsFilterDto = {
      name: 'another',
      page: 1,
      size: 5,
    };
    const result = await repo.findByFilters(filters);

    expect(result.data.length).toBe(1);
    expect(result.data[0].name).toBe('Another Product');
  });

  it('should filter by brand', async () => {
    const filters: FindProductsFilterDto = {
      brand: 'BrandB',
      page: 1,
      size: 5,
    };
    const result = await repo.findByFilters(filters);

    expect(result.data.length).toBe(1);
    expect(result.data[0].brand).toBe('BrandB');
  });

  it('should filter by model', async () => {
    const filters: FindProductsFilterDto = {
      model: 'ModelX',
      page: 1,
      size: 5,
    };
    const result = await repo.findByFilters(filters);

    expect(result.data.length).toBeGreaterThanOrEqual(2);
  });

  it('should filter by category', async () => {
    const filters: FindProductsFilterDto = {
      category: 'Category1',
      page: 1,
      size: 5,
    };
    const result = await repo.findByFilters(filters);

    expect(result.data.length).toBeGreaterThanOrEqual(2);
  });

  it('should filter by color', async () => {
    const filters: FindProductsFilterDto = { color: 'White', page: 1, size: 5 };
    const result = await repo.findByFilters(filters);

    expect(result.data.length).toBe(1);
    expect(result.data[0].color).toBe('White');
  });

  it('should filter by price range', async () => {
    const filters: FindProductsFilterDto = {
      minPrice: 100,
      maxPrice: 200,
      page: 1,
      size: 5,
    };
    const result = await repo.findByFilters(filters);

    expect(result.data.every((p) => p.price >= 100 && p.price <= 200)).toBe(
      true,
    );
  });

  it('should filter by stock range', async () => {
    const filters: FindProductsFilterDto = {
      minStock: 10,
      maxStock: 20,
      page: 1,
      size: 5,
    };
    const result = await repo.findByFilters(filters);

    expect(result.data.every((p) => p.stock >= 10 && p.stock <= 20)).toBe(true);
  });

  it('should filter by currency', async () => {
    const filters: FindProductsFilterDto = {
      currency: 'USD',
      page: 1,
      size: 5,
    };
    const result = await repo.findByFilters(filters);

    expect(result.data.every((p) => p.currency === 'USD')).toBe(true);
  });

  it('should return empty array if no match', async () => {
    const filters: FindProductsFilterDto = {
      sku: 'NON_EXISTENT',
      page: 1,
      size: 5,
    };
    const result = await repo.findByFilters(filters);

    expect(result.data).toEqual([]);
    expect(result.count).toBe(0);
  });

  it('should paginate correctly', async () => {
    const filters: FindProductsFilterDto = { page: 1, size: 2 };
    const result = await repo.findByFilters(filters);

    expect(result.data.length).toBe(2);
  });
});
