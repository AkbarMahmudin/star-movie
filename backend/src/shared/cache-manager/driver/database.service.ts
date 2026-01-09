import { ICacheManager } from '../interface/cache-manager.interface';
import { PrismaService } from '../../../database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService implements ICacheManager {
  constructor(private readonly prisma: PrismaService) {}

  delete(key: string): any {
    return this.prisma.cache.delete({
      where: { key },
    });
  }

  get(key: string): any {
    return this.prisma.cache.findUnique({
      where: {
        key,
        expiredAt: {
          gt: new Date(),
        },
      },
    });
  }

  set(key: string, value: string, ttl?: Date) {
    const data = {
      key,
      value,
      expiredAt: ttl,
    };

    return this.prisma.cache.upsert({
      create: data,
      update: data,
      where: { key },
    });
  }
}
