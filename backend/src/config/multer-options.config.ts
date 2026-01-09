import { type ConfigType } from '@nestjs/config';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import filesConfig from './files.config';

@Injectable()
export class MulterOptionsConfig implements MulterOptionsFactory {
  constructor(
    @Inject(filesConfig.KEY)
    private readonly config: ConfigType<typeof filesConfig>,
  ) {}

  createMulterOptions(): MulterModuleOptions {
    const dest = this.config.dest ?? 'storage';
    fs.mkdirSync(dest, { recursive: true });

    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),

      // 🧠 file size limit tidak bisa ditentukan per field di level global,
      // jadi biarkan default limit besar, lalu validasi detail dilakukan di Pipe.
      limits: {
        fileSize: this.config.default.maxSize * 1024 * 1024, // default global
      },

      fileFilter: (req, file, cb) => {
        try {
          const fieldName = file.fieldname;
          const fieldRule =
            this.config.fields?.[fieldName] ?? this.config.default;

          const allowedMimeTypes =
            fieldRule.allowedMimeTypes ?? this.config.default.allowedMimeTypes;

          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(
              new BadRequestException(
                `Invalid file type for field "${fieldName}": ${file.mimetype}. Allowed: ${allowedMimeTypes.join(', ')}`,
              ),
              false,
            );
          }
        } catch (err) {
          cb(err as Error, false);
        }
      },
    };
  }
}

