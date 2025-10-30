export class ProductResponseDto {
  id: string;
  name: string;
  sku: string;
  picture: {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
  };
  price: {
    amount: number;
    currency: string;
  };
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(product: any): ProductResponseDto {
    const response = new ProductResponseDto();
    response.id = product.id;
    response.name = product.name;
    response.sku = product.sku.toString();
    response.picture = product.picture.toJSON();
    response.price = product.price.toJSON();
    response.createdAt = product.createdAt;
    response.updatedAt = product.updatedAt;
    return response;
  }
}