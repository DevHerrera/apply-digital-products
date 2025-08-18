import {
  IsString,
  IsOptional,
  IsNumber,
  Length,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindProductsFilterDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Unique identifier for the product',
    example: 'SKU12345',
  })
  sku?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Product name', example: 'iPhone 15' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Product brand', example: 'Apple' })
  brand?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Product model', example: 'Pro Max' })
  model?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Product category',
    example: 'Electronics',
  })
  category?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Product color', example: 'Black' })
  color?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: 'Minimum price filter', example: 100 })
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Maximum price filter', example: 1000 })
  maxPrice?: number;

  @IsOptional()
  @Length(3, 3)
  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'USD',
  })
  currency?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Minimum stock filter', example: 10 })
  minStock?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Maximum stock filter', example: 100 })
  maxStock?: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({
    description: 'Page number (must be >= 1)',
    example: 1,
    default: 1,
  })
  page: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(5) // Only 5 products per page are supported
  @ApiProperty({
    description: 'Page size (1–5 items per page)',
    example: 5,
    default: 5,
  })
  size: number;
}
