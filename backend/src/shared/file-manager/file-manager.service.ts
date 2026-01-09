import { Injectable } from '@nestjs/common';
import { BaseService } from '../base';
import { PrismaService } from '../../database/prisma.service';
import { FileMetadata } from '@prisma/client';

@Injectable()
export class FileManagerService extends BaseService {
  protected defaultSearchBy: 'filename';

  protected get modelName(): string {
    return 'FileMetadata';
  }

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findOne(filename: string): Promise<FileMetadata> {
    return await this.primaryModel.findFirstOrThrow({
      where: {
        filename,
      },
    });
  }

  async remove(filename: string) {
    const fileMetadata = await this.findOne(filename);

    return super.remove(fileMetadata.id);
  }

  async createMany(data: Record<string, any>[]) {
    return await this.primaryModel.createManyAndReturn({
      data,
    });
  }
}
