import { Injectable } from '@nestjs/common';
import { ICacheManager } from './interface/cache-manager.interface';
import { DatabaseService } from './driver/database.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheManagerService implements ICacheManager{
  private driver: ICacheManager;

  constructor(private readonly database: DatabaseService, private readonly config: ConfigService) {
    const driver = this.config.get('CACHE_DRIVER') ?? 'database';
    this.driver = this.database;
  }

  delete(key: string): any {
    return this.driver.delete(key);
  }

  get(key: string): any {
    return this.driver.get(key);
  }

  set(key: string, value: string, ttl?: Date): any {
    return this.driver.set(key, value, ttl);
  }
}
