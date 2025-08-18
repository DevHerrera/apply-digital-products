import { IProduct } from '@products/interfaces';

export interface ContentfulProduct {
  items: { fields: IProduct }[];
}
