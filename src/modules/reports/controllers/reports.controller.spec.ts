import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '@reports/controllers';
import { ProductReportService } from '@reports/services';
import {
  DeletedProductsReportResponseDto,
  ProductsByBrandResponseDto,
  ProductsReportFilterDto,
  ProductsReportResponseDto,
} from '@reports/dtos';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ProductReportService;

  const mockProductReportService = {
    getProductsTotalByBrand: jest.fn(),
    getProductsReport: jest.fn(),
    getDeletedProductsReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ProductReportService,
          useValue: mockProductReportService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ProductReportService>(ProductReportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProductsTotalByBrand', () => {
    it('should return total products grouped by brand', async () => {
      const mockResponse: ProductsByBrandResponseDto[] = [
        { brand: 'Nike', totalProducts: 120 },
        { brand: 'Adidas', totalProducts: 80 },
      ];

      mockProductReportService.getProductsTotalByBrand.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.getProductsTotalByBrand();
      expect(result).toEqual(mockResponse);
      expect(service['getProductsTotalByBrand']).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductsReport', () => {
    it('should return products report with filters', async () => {
      const filters: ProductsReportFilterDto = { minPrice: 10, maxPrice: 100 };
      const mockResponse: ProductsReportResponseDto = {
        productsMatched: 200,
        activeProductsMatched: 180,
        percentageActive: '90.00%',
      };

      mockProductReportService.getProductsReport.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.getProductsReport(filters);
      expect(result).toEqual(mockResponse);
      expect(service['getProductsReport']).toHaveBeenCalledWith(filters);
    });
  });

  describe('getDeletedProductsReport', () => {
    it('should return deleted products report', async () => {
      const mockResponse: DeletedProductsReportResponseDto = {
        totalProducts: 500,
        totalDeletedProducts: 100,
        percentageDeletedProducts: '20.00%',
      };

      mockProductReportService.getDeletedProductsReport.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.getDeletedProductsReport();
      expect(result).toEqual(mockResponse);
      expect(service['getDeletedProductsReport']).toHaveBeenCalledTimes(1);
    });
  });
});
