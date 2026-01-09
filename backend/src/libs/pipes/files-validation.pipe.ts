import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Inject,
  Optional,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import filesConfig from '../../config/files.config';
import * as fs from 'fs';

export interface FileValidationOptions {
  rules?: Record<
    string,
    {
      maxSize?: number;
      allowedMimeTypes?: string[];
    }
  >;
}

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  constructor(
    @Inject(filesConfig.KEY)
    private readonly fileCfg: ConfigType<typeof filesConfig>,
    @Optional()
    private readonly overrideOptions?: FileValidationOptions,
  ) {}

  transform(
    input: Express.Multer.File | Express.Multer.File[] | Record<string, Express.Multer.File[]>,
  ): any {
    if (!input) {
      throw new BadRequestException('No file uploaded');
    }

    // 🔍 Tentukan tipe input
    if (this.isSingleFile(input)) {
      return this.validateFile(input, 'file');
    }

    if (Array.isArray(input)) {
      return input.map((f) => this.validateFile(f, 'file'));
    }

    if (typeof input === 'object') {
      // FileFieldsInterceptor case
      for (const [fieldName, files] of Object.entries(input)) {
        input[fieldName] = files.map((file) =>
          this.validateFile(file, fieldName),
        );
      }
      return input;
    }

    throw new BadRequestException('Invalid upload input interface');
  }

  private validateFile(file: Express.Multer.File, fieldName: string) {
    if (!file) {
      throw new BadRequestException(`File is missing in field "${fieldName}"`);
    }

    // Ambil rule (prioritas override > per-field config > default)
    const rules =
      this.overrideOptions?.rules?.[fieldName] ??
      this.fileCfg.fields?.[fieldName] ??
      this.fileCfg.default;

    const maxSize = rules.maxSize ?? this.fileCfg.default.maxSize;
    const allowedMimeTypes =
      rules.allowedMimeTypes ?? this.fileCfg.default.allowedMimeTypes;

    const maxSizeInBytes = maxSize * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      fs.unlinkSync(file.path);
      throw new BadRequestException(
        `File "${file.originalname}" in field "${fieldName}" exceeds ${maxSize}MB`,
      );
    }

    if (
      allowedMimeTypes.length &&
      !allowedMimeTypes.includes(file.mimetype)
    ) {
      fs.unlinkSync(file.path);
      throw new BadRequestException(
        `Invalid file type for "${fieldName}". Allowed: ${allowedMimeTypes.join(', ')}`,
      );
    }

    return file;
  }

  private isSingleFile(input: any): input is Express.Multer.File {
    return input && typeof input === 'object' && 'mimetype' in input && 'size' in input;
  }
}
