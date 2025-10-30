import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { 
  ProductRepository, 
  SearchFilters, 
  SearchOptions, 
  SearchResult 
} from '../../../domain/repositories/product.repository.interface';
import { Product } from '../../../domain/entities/product.entity';
import { ProductDocument, ProductModel } from './product.schema';

@Injectable()
export class MongoProductRepository implements ProductRepository {
  constructor(
    @InjectModel(ProductModel.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async save(product: Product): Promise<Product> {
    const primitives = product.toPrimitives();
    
    const existingProduct = await this.productModel.findOne({ id: primitives.id });
    
    if (existingProduct) {
      await this.productModel.updateOne(
        { id: primitives.id },
        { $set: primitives },
      );
    } else {
      await this.productModel.create(primitives);
    }

    return product;
  }

  async findById(id: string): Promise<Product | null> {
    const doc = await this.productModel.findOne({ id }).exec();
    
    if (!doc) {
      return null;
    }

    return this.toDomain(doc);
  }

  async findByName(name: string): Promise<Product | null> {
    const doc = await this.productModel.findOne({ name }).exec();
    
    if (!doc) {
      return null;
    }

    return this.toDomain(doc);
  }

  async findBySKU(sku: string): Promise<Product | null> {
    const doc = await this.productModel.findOne({ sku }).exec();
    
    if (!doc) {
      return null;
    }

    return this.toDomain(doc);
  }

  async findAll(): Promise<Product[]> {
    const docs = await this.productModel.find().exec();
    return docs.map(doc => this.toDomain(doc));
  }

  async delete(id: string): Promise<void> {
    await this.productModel.deleteOne({ id }).exec();
  }

  async search(filters: SearchFilters, options: SearchOptions): Promise<SearchResult> {
    const query: any = {};

    if (filters.name) {
      query.name = filters.name;
    }

    if (filters.sku) {
      query.sku = filters.sku;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) {
        query.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        query.price.$lte = filters.maxPrice;
      }
    }

    const sortField = options.sortBy || 'createdAt';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortDirection } as Record<string, 1 | -1>;

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.productModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(query).exec(),
    ]);

    const products = docs.map(doc => this.toDomain(doc));

    return { products, total };
  }

  private toDomain(doc: ProductDocument): Product {
    return Product.reconstitute(
      doc.id,
      doc.name,
      doc.sku,
      doc.price,
      doc.pictureUrl,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
