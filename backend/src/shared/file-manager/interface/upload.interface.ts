import { StorageType } from '@prisma/client';

export interface IUploadResponse {
  url: string;
  filename: string;
  originalname: string;
  extension: string;
  size: number;
  type: StorageType;
  fieldName?: string | null;
  thumbnail?: string | null;
}

export interface IUpload {
  uploadFile(
    files:
      | Express.Multer.File
      | Express.Multer.File[]
      | Record<string, Express.Multer.File[]>,
  ): Promise<
    IUploadResponse | IUploadResponse[] | Record<string, IUploadResponse[]>
  >;

  getFile(filename: string): Promise<any>;

  deleteFile?(key: string): Promise<void>;
}
