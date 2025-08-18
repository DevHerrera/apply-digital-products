import { Test, TestingModule } from '@nestjs/testing';
import { ProductReportService } from '@reports/services';
import { ProductRepository } from '@products/repositories';
import {
  DeletedProductsReportResponseDto,
  ProductsByBrandResponseDto,
  ProductsReportFilterDto,
  ProductsReportResponseDto,
} from '@reports/dtos';

describe('ProductReportService', () => {
  let service: ProductReportService;
  let repository: ProductRepository;

  const mockProductRepository = {
    getDeletedProductsReport: jest.fn(),
    getActiveProductsReport: jest.fn(),
    getProductsTotalByBrand: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductReportService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductReportService>(ProductReportService);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDeletedProductsReport', () => {
    it('should return deleted products report', async () => {
      const mockResponse: DeletedProductsReportResponseDto = {
        totalProducts: 500,
        totalDeletedProducts: 100,
        percentageDeletedProducts: '20.00%',
      };

      mockProductRepository.getDeletedProductsReport.mockResolvedValue(
        mockResponse,
      );

      const result = await service.getDeletedProductsReport();
      expect(result).toEqual(mockResponse);
      expect(repository['getDeletedProductsReport']).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductsReport', () => {
    it('should return active products report with filters', async () => {
      const filters: ProductsReportFilterDto = { minPrice: 10, maxPrice: 100 };
      const mockResponse: ProductsReportResponseDto = {
        productsMatched: 200,
        activeProductsMatched: 180,
        percentageActive: '90.00%',
      };

      mockProductRepository.getActiveProductsReport.mockResolvedValue(
        mockResponse,
      );

      const result = await service.getProductsReport(filters);
      expect(result).toEqual(mockResponse);
      expect(repository['getActiveProductsReport']).toHaveBeenCalledWith(
        filters,
      );
    });
  });

  describe('getProductsTotalByBrand', () => {
    it('should return total products grouped by brand', async () => {
      const mockResponse: ProductsByBrandResponseDto[] = [
        { brand: 'Nike', totalProducts: 120 },
        { brand: 'Adidas', totalProducts: 80 },
      ];

      mockProductRepository.getProductsTotalByBrand.mockResolvedValue(
        mockResponse,
      );

      const result = await service.getProductsTotalByBrand();
      expect(result).toEqual(mockResponse);
      expect(repository['getProductsTotalByBrand']).toHaveBeenCalledTimes(1);
    });
  });
});
