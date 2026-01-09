import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Inject,
  Optional,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import fileConfig from '../../config/file.config';
import * as fs from 'fs';

interface FileValidationOptions {
  maxSize?: number;
  allowedMimeTypes?: string[];
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    @Inject(fileConfig.KEY)
    private readonly defaultOptions: ConfigType<typeof fileConfig>,
    @Optional()
    private readonly overrideOptions?: FileValidationOptions,
  ) {}

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const maxSize =
      this.overrideOptions?.maxSize ?? this.defaultOptions?.maxSize;
    const allowedMimeTypes =
      this.overrideOptions?.allowedMimeTypes ??
      this.defaultOptions.allowedMimeTypes;

    // Size validation
    const maxSizeInBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      // Delete if not valid
      fs.unlinkSync(file.path);
      throw new BadRequestException(`File size should not exceed ${maxSize}MB`);
    }

    // MIME interface validation
    if (allowedMimeTypes.length && !allowedMimeTypes.includes(file.mimetype)) {
      fs.unlinkSync(file.path);
      throw new BadRequestException(
        `Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`,
      );
    }

    return file;
  }
}
