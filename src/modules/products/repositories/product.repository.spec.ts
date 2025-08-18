import { DataSource } from 'typeorm';
import { ProductRepository } from '@products/repositories';
import { Product } from '@products/entities';
import { IProduct } from '@products/interfaces';
import { FindProductsFilterDto } from '@products/dtos';
import { ProductsReportFilterDto } from '@reports/dtos';

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
      const filters: FindProductsFilterDto = {
        color: 'White',
        page: 1,
        size: 5,
      };
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

      expect(result.data.every((p) => p.stock >= 10 && p.stock <= 20)).toBe(
        true,
      );
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

  describe('Reports / Aggregates', () => {
    beforeAll(async () => {
      await repo.save([
        { ...baseProduct, sku: 'SKU_DEL_1', isActive: false },
        { ...baseProduct, sku: 'SKU_DEL_2', isActive: false },
        {
          ...baseProduct,
          sku: 'SKU_ACTIVE_1',
          brand: 'BrandA',
          isActive: true,
        },
        {
          ...baseProduct,
          sku: 'SKU_ACTIVE_2',
          brand: 'BrandB',
          isActive: true,
        },
        {
          ...baseProduct,
          sku: 'SKU_ACTIVE_3',
          brand: 'BrandA',
          isActive: true,
        },
      ]);
    });

    describe('getDeletedProductsReport', () => {
      it('should return correct totals and percentage of deleted products', async () => {
        const result = await repo.getDeletedProductsReport();

        expect(result.totalProducts).toBeGreaterThanOrEqual(8);
        expect(result.totalDeletedProducts).toBe(2);
        expect(result.percentageDeletedProducts).toMatch(/\d+(\.\d{2})?%/);
      });
    });

    describe('getActiveProductsReport', () => {
      it('should return correct counts and percentage for active products with no filters', async () => {
        const filters: ProductsReportFilterDto = {};
        const result = await repo.getActiveProductsReport(filters);

        const totalProducts = await repo.count();
        const totalActive = await repo.count({ where: { isActive: true } });

        expect(result.productsMatched).toBe(totalProducts);
        expect(result.activeProductsMatched).toBe(totalActive);
        expect(result.percentageActive).toBe(
          ((totalActive / totalProducts) * 100).toFixed(2) + '%',
        );
      });

      it('should apply price filter correctly', async () => {
        const filters: ProductsReportFilterDto = { minPrice: 200 };
        const result = await repo.getActiveProductsReport(filters);

        const allMatch = await repo
          .createQueryBuilder('product')
          .where('product.isActive = true')
          .andWhere('product.price >= :minPrice', { minPrice: 200 })
          .getCount();

        expect(result.activeProductsMatched).toBe(allMatch);
      });
    });

    describe('getProductsTotalByBrand', () => {
      it('should return total products grouped by brand', async () => {
        const result = await repo.getProductsTotalByBrand();

        expect(result.length).toBeGreaterThanOrEqual(2); // BrandA and BrandB
        const brandA = result.find((r) => r.brand === 'BrandA');
        const brandB = result.find((r) => r.brand === 'BrandB');

        expect(brandA?.totalProducts).toBeGreaterThanOrEqual(3);
        expect(brandB?.totalProducts).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
