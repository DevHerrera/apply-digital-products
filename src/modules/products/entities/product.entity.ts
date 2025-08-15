import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryColumn({ unique: true })
  sku: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  brand: string;

  @Column({ nullable: false })
  model: string;

  @Column({ nullable: false })
  category: string;

  @Column({ nullable: false })
  color: string;

  @Column('decimal', { nullable: false, precision: 10, scale: 2 })
  price: number;

  @Column({ length: 3 })
  currency: string;

  @Column('int', { nullable: false })
  stock: number;

  @Column('bool', { nullable: false, name: 'is_active', default: true })
  isActive: boolean;
}
