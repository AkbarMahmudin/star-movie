import { ConfigService } from '@nestjs/config';
import { LocalUploadService } from './local-upload.service';
import { MinioUploadService } from './minio-upload.service';
import { IUpload, IUploadResponse } from '../interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploaderService implements IUpload {
  private driver: IUpload;

  constructor(
    private readonly local: LocalUploadService,
    private readonly minio: MinioUploadService,
    private readonly config: ConfigService,
  ) {
    const driver = this.config.get('STORAGE_DRIVER') ?? 'local';
    this.driver = driver === 'minio' ? this.minio : this.local;
  }

  deleteFile(key: string): Promise<void> {
    if (!this.driver?.deleteFile) {
      return Promise.resolve(undefined);
    }

    return this.driver?.deleteFile(key);
  }

  getFile(filename: string): Promise<any> {
    return this.driver.getFile(filename);
  }

  uploadFile(
    files:
      | Express.Multer.File
      | Express.Multer.File[]
      | Record<string, Express.Multer.File[]>,
  ): Promise<
    IUploadResponse | IUploadResponse[] | Record<string, IUploadResponse[]>
  > {
    return this.driver.uploadFile(files);
  }
}
