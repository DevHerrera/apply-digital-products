import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { ProductsModule } from '@products/products.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/config.validation';

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true, // makes config available everywhere
      envFilePath: '.env', // path to your .env file
      validationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
