import { Global, Module } from '@nestjs/common';
import { CacheManagerService } from './cache-manager.service';
import { DatabaseService } from './driver/database.service';

@Global()
@Module({
  providers: [CacheManagerService, DatabaseService],
  exports: [CacheManagerService, DatabaseService],
})
export class CacheManagerModule {}
