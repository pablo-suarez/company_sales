import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private readonly uploadsDir: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadsDir = this.configService.get<string>('UPLOADS_DIR') || './uploads/products';
    this.baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
  }

  async onModuleInit() {
    await this.ensureUploadsDirExists();
  }

  private async ensureUploadsDirExists(): Promise<void> {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadsDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    return `${this.baseUrl}/uploads/products/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadsDir, fileName);
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  getValidImageMimeTypes(): string[] {
    return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  }

  isValidImageFile(file: Express.Multer.File): boolean {
    return this.getValidImageMimeTypes().includes(file.mimetype);
  }
}