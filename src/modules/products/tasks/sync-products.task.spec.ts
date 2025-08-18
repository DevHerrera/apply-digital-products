import { Test, TestingModule } from '@nestjs/testing';
import { SyncProductsTask } from './sync-products.task';
import { ProductRepository } from '@products/repositories';
import { ContentfulApiClient } from '@products/api-clients';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

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
          useValue: { fetchProducts: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('*/30 * * * * *') },
        },
        {
          provide: SchedulerRegistry,
          useValue: { addCronJob: jest.fn() },
        },
      ],
    }).compile();

    task = module.get<SyncProductsTask>(SyncProductsTask);
    repo = module.get<ProductRepository>(ProductRepository);
    client = module.get<ContentfulApiClient>(ContentfulApiClient);
  });

  it('should be defined', () => {
    expect(task).toBeDefined();
  });

  it('should fetch and sync products', async () => {
    const products = [
      { sku: 'SKU1', name: 'Product 1' },
      { sku: 'SKU2', name: 'Product 2' },
    ];

    (client.fetchProducts as jest.Mock).mockResolvedValue(products);

    await task['handleCron']();

    expect(client['fetchProducts']).toHaveBeenCalled();
    expect(repo['findOrSync']).toHaveBeenCalledTimes(products.length);
    expect(repo['findOrSync']).toHaveBeenCalledWith(products[0]);
    expect(repo['findOrSync']).toHaveBeenCalledWith(products[1]);
  });
});
