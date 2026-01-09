import { FileMetadata } from '@prisma/client';
import * as process from 'node:process';

export class FileMetadataViewModel {
  static fromEntity(file: FileMetadata) {
    const baseUrl = process?.env?.API_URL;

    return {
      id: file.id,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      extension: file.extension,
      type: file.fieldName,
      url: baseUrl !== undefined ? `${baseUrl}/api/file-managers/${file.filename}` : file.url,
      createdAt:
        typeof file?.createdAt === 'string'
          ? file?.createdAt
          : file?.createdAt?.toISOString(),
      updatedAt:
        typeof file?.updatedAt === 'string'
          ? file?.updatedAt
          : file?.updatedAt?.toISOString(),
    };
  }

  static fromEntities(files: FileMetadata[]) {
    return files.map(this.fromEntity);
  }
}
