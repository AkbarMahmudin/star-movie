import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { QueryFilter } from '../../libs/filters';
import { BaseService } from '../../shared/base';

@Injectable()
export class AnalyticService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(query: QueryFilter) {
    const { where } = BaseService.pagination(query);

    const countMovie = await this.prisma.movie.count({
      where,
    });
    const countGenre = await this.prisma.movie.count({
      where,
    });
    const { _avg } = await this.prisma.movie.aggregate({
      _avg: {
        voteAvg: true,
        popularity: true,
      },
      where,
    });

    return {
      count: {
        movie: countMovie,
        genre: countGenre,
      },
      average: _avg,
    };
  }

  async countGroupGenreMovie(query: QueryFilter) {
    const { where } = BaseService.pagination({
      ...query,
      rangeDateBy: 'releaseDate',
    });

    const result = await this.prisma.genre.findMany({
      select: {
        name: true,
        _count: {
          select: {
            movies: {
              where,
            },
          },
        },
      },
      orderBy: {
        movies: {
          _count: 'desc',
        },
      },
      ...(query.limit && { take: +query.limit }),
    });

    return result?.map((genre) => ({
      name: genre.name,
      count: genre._count,
    }));
  }

  async countGroupMovie(query: QueryFilter) {
    const { where } = BaseService.pagination({
      ...query,
      rangeDateBy: 'releaseDate',
    });

    const countMovie = await this.prisma.movie.groupBy({
      by: ['releaseDate'],
      where,
      _count: {
        id: true,
      },
      orderBy: {
        releaseDate: 'desc',
      },
    });

    return countMovie?.map((movie) => ({
      releaseDate: movie.releaseDate,
      count: movie._count?.id,
    }));
  }
}
