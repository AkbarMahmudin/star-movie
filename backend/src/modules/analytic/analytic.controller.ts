import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticService } from './analytic.service';
import { QueryFilter } from '../../libs/filters';

@Controller('analytics')
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

  @Get('summary')
  summary(@Query() query: QueryFilter) {
    return this.analyticService.summary(query);
  }

  @Get('chart/genre')
  countGroupGenreMovie(@Query() query: QueryFilter) {
    return this.analyticService.countGroupGenreMovie(query);
  }

  @Get('chart/movie')
  countGroupMovie(@Query() query: QueryFilter) {
    return this.analyticService.countGroupMovie(query);
  }
}
