import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ContentfulApiClient } from '@products/api-clients';
import { ProductRepository } from '@products/repositories';
import { ConfigService } from '@nestjs/config';
import { CronExpression } from '@nestjs/schedule';

@Injectable()
export class SyncProductsTask implements OnModuleInit {
  private readonly logger = new Logger(SyncProductsTask.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly contentfulClient: ContentfulApiClient,
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    const interval =
      this.config.get<string>('CONTENTFUL_FETCH_INTERVAL') ||
      CronExpression.EVERY_HOUR;

    const job = new CronJob(interval, () => this.handleCron());
    this.schedulerRegistry.addCronJob('syncProductsJob', job);
    job.start();
  }

  private async handleCron() {
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
