import { ApiProperty } from '@nestjs/swagger';

export class DeletedProductsReportResponseDto {
  @ApiProperty({
    description: 'Total number of products in the system',
    example: 1200,
  })
  totalProducts: number;

  @ApiProperty({
    description: 'Total number of deleted (inactive) products',
    example: 300,
  })
  totalDeletedProducts: number;

  @ApiProperty({
    description: 'Percentage of deleted products',
    example: '25.00%',
  })
  percentageDeletedProducts: string;
}
