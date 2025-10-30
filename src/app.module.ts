import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './contexts/auth/infrastructure/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { ProductsModule } from './contexts/products/infrastructure/products.module';
import { OrdersModule } from './contexts/orders/infrastructure/orders.module';


@Module({
  imports: [
      ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://userAdmin:UserPassword@localhost:27017/',
      {
        retryWrites: true,
        w: 'majority',
      }
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
