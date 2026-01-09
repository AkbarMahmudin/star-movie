import {Header} from "@/components/header.tsx";
import {StatCard} from "@/components/dashboard/stat-card.tsx";
import {Film, StarIcon, Tags, Vote} from "lucide-react";
import useSWR from "swr";
import {genre, summary} from "@/api/analytic.ts";
import {PieChartGenre} from "@/components/dashboard/pie-chart.tsx";
import {LineCharMovie} from "@/components/dashboard/line-chart.tsx";
import {TopTable} from "@/components/dashboard/top-table.tsx";
import {findAllMovie} from "@/api/movie.ts";

export default function Dashboard() {
  const {data} = useSWR(
    'http://localhost:3000/api/analytics/summary',
    summary
  );

  const {data: movies, isLoading: isMovieLoad} = useSWR(
    'http://localhost:3000/api/movies?limit=5&orderBy=voteAvg',
    findAllMovie
  );

  const {data: genres, isLoading: isGenreLoad} = useSWR(
    'http://localhost:3000/api/analytics/chart/genre?limit=5',
    genre
  );

  const stat = data?.data || {
    count: {
      movie: 0,
      genre: 0,
    },
    average: {
      voteAvg: '0',
      popularity: '1',
    },
  };

  return (
    <>
      <Header title="Overview" description=""/>

      <section className="space-y-6 p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Movies"
            value={stat.count.movie}
            icon={Film}
            variant="primary"
          />
          <StatCard
            title="Total Genres"
            value={stat.count.genre}
            icon={Tags}
            variant="accent"
          />
          <StatCard
            title="Vote"
            value={Number(stat.average.voteAvg).toFixed(2)}
            icon={Vote}
          />
          <StatCard
            title="Popularity"
            value={Number(stat.average.popularity).toFixed(2)}
            icon={StarIcon}
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 p-4">
        <LineCharMovie/>
        <TopTable data={movies?.data} accessorKey="title" title="Top Movies" isLoading={isMovieLoad} />
      </section>

      <section className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 p-4">
        <TopTable data={genres?.data} accessorKey="name" title="Top Genres" isLoading={isGenreLoad} />
        <PieChartGenre/>
      </section>
    </>
  )
}