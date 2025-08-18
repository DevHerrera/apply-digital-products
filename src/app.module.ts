import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { ProductsModule } from '@products/products.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/environment-validation.config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
