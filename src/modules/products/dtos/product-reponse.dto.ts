import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 'SKU12345' })
  sku: string;

  @ApiProperty({ example: 'Wireless Headphones' })
  name: string;

  @ApiProperty({ example: 'Sony' })
  brand: string;

  @ApiProperty({ example: 'WH-1000XM4' })
  model: string;

  @ApiProperty({ example: 'Electronics' })
  category: string;

  @ApiProperty({ example: 'Black' })
  color: string;

  @ApiProperty({ example: 299.99 })
  price: number;

  @ApiProperty({ example: 'USD', description: 'Currency code (ISO 4217)' })
  currency: string;

  @ApiProperty({ example: 42 })
  stock: number;

  @ApiProperty({ example: true })
  isActive: boolean;
}
