import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { QueryFilter } from '../../libs/filters';
import { PaginationInterceptor } from '../../libs/interceptors';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post('sync')
  sync() {
    return this.genreService.syncGenres();
  }

  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  @UseInterceptors(new PaginationInterceptor())
  async findAll(@Query() query: QueryFilter) {
    const [count, data] = await this.genreService.findAll(query);

    return { count, data };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(+id, updateGenreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genreService.remove(+id);
  }
}
