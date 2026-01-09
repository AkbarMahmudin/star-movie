import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { BaseService, IServicePaginationOptions } from '../../shared/base';
import { PrismaService } from '../../database/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { async, firstValueFrom, lastValueFrom } from 'rxjs';
import { QueryFilter } from '../../libs/filters';
import { query } from 'express';
import { options } from 'axios';

@Injectable()
export class GenreService extends BaseService {
  protected defaultSearchBy: string = 'name';

  protected get modelName(): string {
    return 'Genre';
  }

  protected get primaryModel(): typeof this.prisma.genre {
    return this.prisma.genre;
  }

  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    protected readonly prisma: PrismaService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    super(prisma);

    this.apiUrl = this.config.getOrThrow('TMDB_API_URL');
    this.apiKey = this.config.getOrThrow('TMDB_API_KEY');
  }

  async findAll(query: QueryFilter, options?: IServicePaginationOptions) {
    return super.findAll(query, {
      pagination: {
        omit: { externalId: true, deletedAt: true },
      },
    });
  }

  async syncGenres() {
    try {
      const {
        data: { genres = [] },
      } = await firstValueFrom(
        this.http.get(`${this.apiUrl}/genre/movie/list`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }),
      );

      if (genres.length) {
        await this.prisma.$transaction(async (trx) => {
          for (const genre of genres) {
            await trx.genre.upsert({
              where: {
                externalId: genre?.id,
              },
              create: {
                externalId: genre?.id,
                name: genre?.name,
                lastSyncAt: new Date(),
              },
              update: {
                name: genre?.name,
                lastSyncAt: new Date(),
              },
            });
          }
        });
      }

      return genres;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'TMDB API error',
        error.response?.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
