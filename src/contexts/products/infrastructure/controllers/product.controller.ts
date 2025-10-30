import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { multerConfig } from '../../../../shared/infrastructure/config/multer.config';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { GetProductUseCase } from '../../application/dto/get-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { SearchProductsUseCase } from '../../application/use-cases/search-products.use-case';
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { UpdateProductDto } from '../../application/dto/update-product.dto';
import { SearchProductsDto } from '../../application/dto/search-products.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly searchProductsUseCase: SearchProductsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('picture', multerConfig))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const product = await this.createProductUseCase.execute(createProductDto, file);
    return product.toPrimitives();
  }

  @Get('search')
  async search(@Query() searchDto: SearchProductsDto) {
    return await this.searchProductsUseCase.execute(searchDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.getProductUseCase.execute(id);
    return product.toPrimitives();
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('picture', multerConfig))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const product = await this.updateProductUseCase.execute(id, updateProductDto, file);
    return product.toPrimitives();
  }
}