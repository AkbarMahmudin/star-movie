import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { QueryFilter } from '../../libs/filters';
import { currDay, toCamelCase } from '../../libs/utils';
import {
  IPaginationOptions,
  IResultPaginationOptions,
} from '../../common/interfaces';
import {
  IServiceOptions,
  IServicePaginationOptions,
  IServiceSingleOptions,
} from './';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import { ClsService } from 'nestjs-cls';

@Injectable()
export abstract class BaseService {
  protected abstract defaultSearchBy: string;

  // Ex: this.prisma.user, this.prisma.post, dst.
  protected get primaryModel(): any {
    return this.prisma[toCamelCase(this.modelName)];
  }

  protected abstract get modelName(): string;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly cls?: ClsService,
  ) {}

  async create(data: Record<string, any>) {
    return await this.primaryModel.create({ data });
  }

  async findAll(query: QueryFilter, options?: IServicePaginationOptions) {
    if (!query?.searchBy) query.searchBy = this.defaultSearchBy || '';

    const paginateOptions = BaseService.pagination(query, options?.pagination);

    return this.prisma.$transaction([
      this.primaryModel.count({
        where: {
          deletedAt: null,
          ...paginateOptions?.where,
        },
      }),
      this.primaryModel.findMany({
        ...paginateOptions,
        where: {
          deletedAt: null,
          ...paginateOptions?.where,
        },
      }),
    ]);
  }

  async findOne(id: number | string, options?: IServiceSingleOptions) {
    return this.primaryModel.findUniqueOrThrow({
      where: { id, deletedAt: null },
      include: options?.include,
    });
  }

  async update(
    id: number | string,
    data: Record<string, any>,
    options?: IServiceOptions,
  ) {
    return this.primaryModel.update({ where: { id, deletedAt: null }, data });
  }

  async remove(id: number | string, options?: IServiceOptions) {
    // Cari record yang mau dihapus
    const record = await this.primaryModel.findUniqueOrThrow({
      where: { id, deletedAt: null },
    });

    // Ambil semua field unik
    const uniqueFields = this.getUniqueFields();

    // Siapkan nilai baru untuk field unik
    const updateData: Record<string, any> = {};
    uniqueFields.map((field) => {
      const value = record[field];
      if (value !== null && value !== undefined) {
        // Bisa di-null-kan kalau schema mengizinkan null
        // Kalau tidak, gunakan random string
        updateData[field] = null;
      }
    });

    // Update field unik biar bisa dipakai ulang
    if (Object.keys(updateData).length > 0) {
      await this.primaryModel.update({
        where: { id },
        data: updateData,
      });
    }

    return this.primaryModel.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: number | string, options?: IServiceOptions) {
    // Cari record yang sudah dihapus (deletedAt != null)
    const record = await this.primaryModel.findUniqueOrThrow({
      where: { id, deletedAt: { not: null } },
    });

    // Ambil semua field unik (misalnya email, username, dsb.)
    const uniqueFields = this.getUniqueFields();

    // Pastikan field unik belum digunakan oleh record lain yang aktif
    for (const field of uniqueFields) {
      const value = record[field];
      if (!value) continue;

      const exists = await this.primaryModel.findFirst({
        where: {
          [field]: value.replace(/_[a-f0-9]{8}$/, ''), // buang suffix random dari soft delete
          deletedAt: null,
        },
      });

      if (exists) {
        // Jika sudah dipakai user lain, append suffix baru
        record[field] = `${value}_${randomBytes(4).toString('hex')}`;
      } else {
        // Kalau aman, pulihkan ke nilai aslinya (tanpa suffix)
        record[field] = value.replace(/_[a-f0-9]{8}$/, '');
      }
    }

    // Lakukan update data: pulihkan deletedAt = null dan unique field
    return this.primaryModel.update({
      where: { id },
      data: {
        deletedAt: null,
        ...Object.fromEntries(uniqueFields.map(f => [f, record[f]])),
      },
    });
  }

  private getUniqueFields(): string[] {
    const modelMeta = (Prisma as any).dmmf.datamodel.models.find(
      (m) => m.name === this.modelName,
    );
    if (!modelMeta) return [];

    // Ambil semua field dengan isUnique = true
    return modelMeta.fields
      .filter((f) => f.isUnique && !f.isId)
      .map((f) => f.name);
  }

  static pagination(query: QueryFilter, options?: IPaginationOptions) {
    const {
      page = 1,
      limit = 10,
      order,
      orderBy,
      search,
      searchBy,
      rangeDate,
      rangeDateBy,
    } = query;
    const take = +limit;
    const skip = (+page - 1) * take;
    let where: Record<string, any> = {};

    if (searchBy && search) {
      if (Array.isArray(searchBy)) {
        where.OR = searchBy.map((item) => ({
          [item]: { contains: search, mode: 'insensitive' },
        }));
      } else {
        where[searchBy] = { contains: search, mode: 'insensitive' };
      }
    }

    if (rangeDateBy && rangeDate) {
      where[rangeDateBy] = {
        lte: rangeDate[1],
        gte: rangeDate[0],
      };
    }

    if (typeof options?.whereCallback === 'function') {
      where = options?.whereCallback(where) || where;
    }

    let orderOptions:
      | Record<string, string | { sort: string }>
      | Record<string, string | { sort: string }>[];

    if (Array.isArray(orderBy)) {
      // @ts-ignore
      orderOptions = orderBy.map((item) => ({ [item]: order }));
    } else {
      orderOptions = {
        // @ts-ignore
        [orderBy]: order,
      };
    }

    const resultOptions: IResultPaginationOptions = {
      where,
      orderBy: orderOptions,
      include: options?.include,
      select: options?.select,
      omit: options?.omit,
    };

    if (limit !== '*') {
      resultOptions.skip = skip;
      resultOptions.take = take;
    }

    return resultOptions;
  }

  static resolveRangeDate(rangeDate?: [Date, Date], isNow = false) {
    const { startOfToday, endOfToday } = currDay();
    if (!rangeDate) return;

    return isNow ? [startOfToday, endOfToday] : rangeDate;
  }
}
