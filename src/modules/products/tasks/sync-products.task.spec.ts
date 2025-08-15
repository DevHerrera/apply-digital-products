import { Test, TestingModule } from '@nestjs/testing';
import { SyncProductsTask } from '@products/tasks';
import { ProductRepository } from '@products/repositories';
import { ContentfulApiClient } from '@products/api-clients';

describe('SyncProductsTask', () => {
  let task: SyncProductsTask;
  let repo: ProductRepository;
  let client: ContentfulApiClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncProductsTask,
        {
          provide: ProductRepository,
          useValue: { findOrSync: jest.fn() },
        },
        {
          provide: ContentfulApiClient,
          useValue: { fetchProducts: jest.fn() },
        },
      ],
    }).compile();

    task = module.get<SyncProductsTask>(SyncProductsTask);
    repo = module.get<ProductRepository>(ProductRepository);
    client = module.get<ContentfulApiClient>(ContentfulApiClient);
  });

  it('should fetch and sync products', async () => {
    const products = [{ sku: '123', name: 'Product 1' }];
    (client.fetchProducts as jest.Mock).mockResolvedValue(products);

    await task.handleCron();

    expect(client['fetchProducts']).toHaveBeenCalled();
    expect(repo['findOrSync']).toHaveBeenCalledWith(products[0]);
  });
});
