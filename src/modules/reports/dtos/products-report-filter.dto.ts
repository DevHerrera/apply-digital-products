import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsNumber, Min } from 'class-validator';

export class ProductsReportFilterDto {
  @ApiPropertyOptional({
    description: 'Minimum price to include',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price to include',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Start date for the created_at filter (inclusive)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for the created_at filter (inclusive)',
    example: '2025-07-01',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
