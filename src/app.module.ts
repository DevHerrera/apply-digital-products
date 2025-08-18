import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { ProductsModule } from '@products/products.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/environment-validation.config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '@auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/guards';
import { ReportsModule } from '@reports/reports.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    DatabaseModule,
    ProductsModule,
    ReportsModule,
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
