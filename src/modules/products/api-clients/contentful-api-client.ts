import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContentfulProduct, IProduct } from '@products/interfaces';

@Injectable()
export class ContentfulApiClient {
  private baseUrl: string;
  private spaceId: string;
  private accessToken: string;
  private environment: string;
  private contentType: string;

  private fetchProductsEndpoint: string;

  private readonly logger = new Logger(ContentfulApiClient.name);

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('CONTENTFUL_BASE_URL') ?? '';
    this.accessToken =
      this.configService.get<string>('CONTENTFUL_ACCESS_TOKEN') ?? '';
    this.spaceId = this.configService.get<string>('CONTENTFUL_SPACE_ID') ?? '';
    this.environment =
      this.configService.get<string>('CONTENTFUL_ENVIRONMENT') ?? '';
    this.contentType =
      this.configService.get<string>('CONTENTFUL_CONTENT_TYPE') ?? '';

    this.fetchProductsEndpoint = `${this.baseUrl}/${this.spaceId}/environments/${this.environment}/entries?access_token=${this.accessToken}&content_type=${this.contentType}`;
  }

  async fetchProducts(): Promise<IProduct[]> {
    try {
      const response = await fetch(this.fetchProductsEndpoint, {
        method: 'GET',
      });

      const data: ContentfulProduct =
        (await response.json()) as unknown as ContentfulProduct;

      return data.items.map((item) => item.fields) || [];
    } catch (err) {
      this.logger.error(`Products API fetch error:`, err);
      throw err;
    }
  }
}
