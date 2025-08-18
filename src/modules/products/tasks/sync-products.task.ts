import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContentfulApiClient } from '@products/api-clients';
import { ProductRepository } from '@products/repositories';

@Injectable()
export class SyncProductsTask {
  private readonly logger = new Logger(SyncProductsTask.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly contentfulClient: ContentfulApiClient,
  ) {}

  @Cron(CronExpression.EVERY_HOUR) // Move to a env variable
  async handleCron() {
    this.logger.log('Fetching products from Contentful...');
    try {
      const data = await this.contentfulClient.fetchProducts();
      await Promise.all(
        data.map((product) => this.productRepository.findOrSync(product)),
      );
    } catch (error) {
      this.logger.error('Error fetching products', error);
    }
  }
}
