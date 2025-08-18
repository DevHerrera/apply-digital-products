import { ApiProperty } from '@nestjs/swagger';

export class ProductsByBrandResponseDto {
  @ApiProperty({ description: 'Brand name', example: 'Nike' })
  brand: string;

  @ApiProperty({
    description: 'Total number of products for this brand',
    example: 120,
  })
  totalProducts: number;
}
