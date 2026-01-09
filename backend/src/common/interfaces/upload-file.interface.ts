export interface IUploadFile {
  uploadFile(
    files: Express.Multer.File | Express.Multer.File[] | Record<string, Express.Multer.File[]>,
  ): Promise<IUploadFileResponse | IUploadFileResponse[] | Record<string, IUploadFileResponse[]>>;

  getFile?(filename: string): Promise<any>;

  deleteFile?(key: string): Promise<void>;
}

export interface IUploadFileResponse {
  url: string;
  filename: string;
  originalname: string;
  extension: string;
  size: number;
}
