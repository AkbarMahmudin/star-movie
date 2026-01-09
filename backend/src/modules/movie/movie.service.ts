import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../../database/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { QueryFilter } from '../../libs/filters';
import { BaseService, IServicePaginationOptions } from '../../shared/base';
import { firstValueFrom } from 'rxjs';
import { IMovieItem } from './interface/movie-item.interface';

@Injectable()
export class MovieService extends BaseService {
  protected defaultSearchBy: string = 'title';

  protected get modelName(): string {
    return 'Movie';
  }

  protected get primaryModel(): typeof this.prisma.movie {
    return this.prisma.movie;
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
        include: {
          genres: true,
        },
      },
    });
  }

  async syncMovies(page: number = 1) {
    try {
      const {
        data: { results = [] },
      } = await firstValueFrom(
        this.http.get(
          `${this.apiUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`,
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
            },
          },
        ),
      );

      const movies: IMovieItem[] = results;

      if (movies.length) {
        await this.prisma.$transaction(async (trx) => {
          for (const movie of movies) {
            const payload = this.buildPayload(movie);

            await trx.movie.upsert({
              where: {
                externalId: movie?.id,
              },
              create: payload,
              update: payload,
            });
          }
        });
      }

      return movies;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.response?.data || 'TMDB API error',
        error.response?.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private buildPayload(payload: IMovieItem) {
    return {
      externalId: payload.id,
      title: payload.title,
      overview: payload.overview,
      posterPath: payload.poster_path,
      popularity: payload.popularity ?? 0,
      voteAvg: payload.vote_average ?? 0,
      voteCount: payload.vote_count ?? 0,
      releaseDate: new Date(payload.release_date),
      lastSyncAt: new Date(),
      genres: {
        connect: payload?.genre_ids?.map((genreId) => ({
          externalId: genreId,
        })),
      },
    };
  }
}
