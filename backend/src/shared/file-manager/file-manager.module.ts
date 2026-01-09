import { Module } from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { FileManagerController } from './file-manager.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterOptionsConfig } from '../../config';
import { LocalUploadService, MinioUploadService, UploaderService } from './driver';
import { ImageConverterHelper, VideoConverterHelper } from './helper';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterOptionsConfig,
    }),
  ],
  controllers: [FileManagerController],
  providers: [
    UploaderService,
    FileManagerService,
    LocalUploadService,
    MinioUploadService,
    VideoConverterHelper,
    ImageConverterHelper,
    // {
    //   provide: UPLOAD_HANDLER,
    //   useClass: MinioUploadService,
    // },
  ],
  exports: [UploaderService, FileManagerService],
})
export class FileManagerModule {}
