import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import type { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { FileUploadService } from '../../../../shared/infrastructure/services/file-upload.service';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.value-objects';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async execute(dto: CreateProductDto, file?: Express.Multer.File): Promise<Product> {
    const existingByName = await this.productRepository.findByName(dto.name);
    if (existingByName) {
      throw new ConflictException('Product with this name already exists');
    }

    const existingBySKU = await this.productRepository.findBySKU(dto.sku);
    if (existingBySKU) {
      throw new ConflictException('Product with this SKU already exists');
    }

    let pictureUrl: string | undefined;
    if (file) {
      if (!this.fileUploadService.isValidImageFile(file)) {
        throw new ConflictException('Invalid image file');
      }
      pictureUrl = await this.fileUploadService.saveFile(file);
    }

    const product = Product.create(
      Uuid.create().getValue(),
      dto.name,
      dto.sku,
      dto.price,
      pictureUrl,
    );

    return await this.productRepository.save(product);
  }
}
