import { ApiProperty } from '@nestjs/swagger';

export class ProductsReportResponseDto {
  @ApiProperty({
    description: 'Total products matching the filters',
    example: 500,
  })
  productsMatched: number;

  @ApiProperty({
    description: 'Total active products matching the filters',
    example: 450,
  })
  activeProductsMatched: number;

  @ApiProperty({
    description: 'Percentage of active products among the matched products',
    example: '90.00%',
  })
  percentageActive: string;
}
