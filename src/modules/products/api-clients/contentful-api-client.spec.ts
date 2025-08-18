import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ContentfulApiClient } from '@products/api-clients';

describe('ContentfulApiClient', () => {
  let client: ContentfulApiClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentfulApiClient,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => `mock_${key}`),
          },
        },
      ],
    }).compile();

    client = module.get<ContentfulApiClient>(ContentfulApiClient);
  });

  it('should fetch products', async () => {
    const mockResponse = {
      items: [{ fields: { sku: '123', name: 'Product 1' } }],
    };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const products = await client.fetchProducts();
    expect(products).toEqual([{ sku: '123', name: 'Product 1' }]);
  });
});
