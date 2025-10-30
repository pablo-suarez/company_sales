import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const multerConfig: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException('Invalid file type. Only JPEG, PNG and WebP are allowed'),
        false
      );
    }
    
    callback(null, true);
  },
};