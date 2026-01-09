import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { GenreModule } from './genre/genre.module';
import { MovieModule } from './movie/movie.module';
import { AnalyticModule } from './analytic/analytic.module';

@Module({
  imports: [
    UserModule,
    GenreModule,
    MovieModule,
    AnalyticModule,
  ],
})
export class ModulesModule {}
