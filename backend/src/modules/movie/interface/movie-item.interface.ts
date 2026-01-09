export interface IMovieItem {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  release_date: string;
}