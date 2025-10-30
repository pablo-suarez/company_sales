import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModel, ProductSchema } from './persistence/mongoose/product.schema';
import { MongoProductRepository } from './persistence/mongoose/product.repository';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository.interface';
import { ProductController } from './controllers/product.controller';
import { FileUploadService } from '../../../shared/infrastructure/services/file-upload.service';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { GetProductUseCase } from '../application/dto/get-product.use-case';
import { SearchProductsUseCase } from '../application/use-cases/search-products.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductModel.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: MongoProductRepository,
    },
    FileUploadService,
    CreateProductUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
    SearchProductsUseCase,
  ],
  exports: [PRODUCT_REPOSITORY, FileUploadService],
})
export class ProductsModule {}