import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { FileManagerModule } from './file-manager/file-manager.module';
import { MinioModule } from './minio/minio.module';
import { CacheManagerModule } from './cache-manager/cache-manager.module';

@Module({
  imports: [
    AuthModule,
    FileManagerModule,
    MinioModule,
    CacheManagerModule,
  ],
})
export class SharedModule {}
