import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  overview: string

  @IsOptional()
  @IsString()
  posterPath?: string


  @IsOptional()
  @IsDecimal()
  voteAvg: string

  @IsOptional()
  @IsNumber()
  voteCount: number

  @IsOptional()
  @IsDecimal()
  popularity: string

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  releaseDate: Date
}
