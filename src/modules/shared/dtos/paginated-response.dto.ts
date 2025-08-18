import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty({ example: 0, description: 'Total number of items' })
  count: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 1, description: 'Results per page' })
  size: number;

  @ApiProperty({ example: 3, description: 'Total number of pages available' })
  totalPages: number;
}
