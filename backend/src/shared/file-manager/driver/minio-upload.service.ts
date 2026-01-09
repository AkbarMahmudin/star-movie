import { Injectable, NotFoundException } from '@nestjs/common';
import { IUpload, IUploadResponse } from '../interface';
import { InjectMinio } from '../../minio/minio.decorator';
import * as Minio from 'minio';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { StorageType } from '@prisma/client';
import { ImageConverterHelper, VideoConverterHelper } from '../helper';

@Injectable()
export class MinioUploadService implements IUpload {
  protected bucketName = 'uploads';

  constructor(
    @InjectMinio() private readonly minio: Minio.Client,
    private videoConverterHelper: VideoConverterHelper,
    private imageConverterHelper: ImageConverterHelper,
    private config: ConfigService,
  ) {
    this.bucketName = this.config.get('MINIO_BUCKET_NAME') ?? 'uploads';
  }

  async getFile(key: string) {
    const filename = key?.split('/')[1] ?? key;

    try {
      return await this.minio.getObject(this.bucketName, key);
    } catch (error) {
      throw new NotFoundException(`Could not find file ${filename}`);
    }
  }

  async deleteFile(filename: string) {
    try {
      await this.getFile(filename);
    } catch (e) {
      throw new NotFoundException(`Could not find file ${filename}`);
    }

    await this.minio.removeObject(this.bucketName, filename);
  }

  async uploadFile(
    files:
      | Express.Multer.File
      | Express.Multer.File[]
      | Record<string, Express.Multer.File[]>,
  ): Promise<IUploadResponse | IUploadResponse[]> {
    console.log('Saving to minio storage...');

    if (!files) {
      throw new Error('No file(s) provided for upload.');
    }

    // 🔹 1️⃣ Single file case
    if (this.isSingleFile(files)) {
      return this.uploadSingle(files);
    }

    // 🔹 2️⃣ Multiple file (same field)
    if (Array.isArray(files)) {
      return Promise.all(files.map((file) => this.uploadSingle(file)));
    }

    // 🔹 3️⃣ Multiple fields
    const result: IUploadResponse[] = [];
    for (const [fieldName, fieldFiles] of Object.entries(files)) {
      const fileUpload = Promise.all(
        fieldFiles.map((file) => this.uploadSingle(file, fieldName)),
      );
      result.push(...(await fileUpload));
    }

    return result;
  }

  private async uploadSingle(
    file: Express.Multer.File,
    fieldName?: string,
  ): Promise<IUploadResponse> {
    const {
      filename,
      originalname,
      size,
      mimetype: extension,
      path: filePath,
    } = await this.optimize(file);

    const dir = fieldName !== 'files' ? `${fieldName}` : '';
    const objectKey = `${dir}/${filename}`;
    const fileStream = fs.createReadStream(filePath);

    await this.minio.putObject(this.bucketName, objectKey, fileStream, size);

    // Delete local temp file after upload
    if (fs.existsSync(file?.path)) fs.unlinkSync(file.path); // raw file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // after compress

    const url = `${this.config.get('API_URL')}/api/file-managers/${filename}`;

    return {
      originalname,
      filename,
      size,
      extension,
      url,
      type: StorageType.CLOUD,
      fieldName: fieldName !== 'files' ? fieldName : null,
    };
  }

  private isSingleFile(input: any): input is Express.Multer.File {
    return (
      input &&
      typeof input === 'object' &&
      'mimetype' in input &&
      'filename' in input
    );
  }

  private async optimize(
    file: Express.Multer.File,
  ): Promise<Express.Multer.File> {
    if (file.mimetype.startsWith('image/')) {
      return await this.imageConverterHelper.compress(file);
    } else if (file.mimetype.startsWith('video/')) {
      return await this.videoConverterHelper.compress(file);
    } else {
      return file;
    }
  }

  /**
   * Generate thumbnail dari video dan upload ke MinIO
   */
  private async takeVideoThumbnail(
    file: Express.Multer.File,
  ): Promise<string | null> {
    if (!file.mimetype.startsWith('video/')) return null;

    const thumbnail = await this.videoConverterHelper.takeScreenShoot(file);
    // save to storage
    await this.minio.putObject(
      this.bucketName,
      `thumbnails/${thumbnail.filename}`,
      thumbnail.stream,
      thumbnail.size,
    );

    fs.unlinkSync(thumbnail.path);

    return thumbnail.filename;
  }
}
