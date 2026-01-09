import { Injectable, NotFoundException } from '@nestjs/common';
import { IUploadResponse, IUpload } from '../interface';
import { ConfigService } from '@nestjs/config';
import { StorageType } from '@prisma/client';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Injectable()
export class LocalUploadService implements IUpload {
  constructor(private readonly config: ConfigService) {}

  async getFile(filename: string): Promise<any> {
    const dest = this.config.get<string>('STORAGE_DEST') ?? 'uploads';
    const filePath = path.join(dest, filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${filename} not found`);
    }

    return fs.readFileSync(filePath);
  }

  async deleteFile(filename: string): Promise<void> {
    const dest = this.config.get<string>('STORAGE_DEST') ?? 'uploads';
    const filePath = path.join(dest, filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${filename} not found`);
    }

    fs.unlinkSync(filePath);
    console.log(`🗑️ File deleted from local: ${filename}`);
  }

  async uploadFile(
    files:
      | Express.Multer.File
      | Express.Multer.File[]
      | Record<string, Express.Multer.File[]>,
  ): Promise<IUploadResponse | IUploadResponse[]> {
    console.log('Saving to local storage...');

    if (!files) {
      throw new Error('No file(s) provided for upload.');
    }

    // 🔹 1️⃣ Single file case
    if (this.isSingleFile(files)) {
      return this.mapFileResponse(files);
    }

    // 🔹 2️⃣ Multiple file (same field)
    if (Array.isArray(files)) {
      return files.map((file) => this.mapFileResponse(file));
    }

    // 🔹 3️⃣ Multiple fields
    const result: IUploadResponse[] = [];
    for (const [fieldName, fieldFiles] of Object.entries(files)) {
      result.push(
        ...fieldFiles.map((file) => this.mapFileResponse(file, fieldName)),
      );
    }

    return result;
  }

  private mapFileResponse(
    file: Express.Multer.File,
    fieldName?: string,
  ): IUploadResponse {
    const publicUrl = `${this.config.getOrThrow('API_URL')}/api/file-managers/${file.filename}`;

    return {
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
      extension: file.mimetype,
      url: publicUrl,
      type: StorageType.LOCAL,
      fieldName,
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
}
