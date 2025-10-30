import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import type { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FileUploadService } from '../../../../shared/infrastructure/services/file-upload.service';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async execute(id: string, dto: UpdateProductDto, file?: Express.Multer.File): Promise<Product> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (dto.name) {
      const existingProduct = await this.productRepository.findByName(dto.name);
      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException('Product with this name already exists');
      }
      product.updateName(dto.name);
    }

    if (dto.price !== undefined) {
      product.updatePrice(dto.price);
    }

    if (file) {
      if (!this.fileUploadService.isValidImageFile(file)) {
        throw new ConflictException('Invalid image file');
      }

      const oldPictureUrl = product.getPictureUrl();
      if (oldPictureUrl) {
        await this.fileUploadService.deleteFile(oldPictureUrl);
      }

      const newPictureUrl = await this.fileUploadService.saveFile(file);
      product.updatePicture(newPictureUrl);
    }

    return await this.productRepository.save(product);
  }
}
