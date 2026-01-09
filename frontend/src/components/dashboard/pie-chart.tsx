import {Pie, PieChart} from "recharts"

import {
  Card,
  CardContent,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import useSWR from "swr";
import {genre} from "@/api/analytic.ts";

export function PieChartGenre() {
  const { data } = useSWR(
    "http://localhost:3000/api/analytics/chart/genre",
    genre
  )

  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]

  const pieData =
    data?.data?.map((item: any, index: number) => ({
      name: item.name,
      value: item.count.movies,
      fill: chartColors[index % chartColors.length],
    })) ?? []

  const main = pieData.slice(0, 5)
  const others = pieData.slice(5)

  const othersTotal = others.reduce(
    (sum, item) => sum + item.value,
    0
  )

  const finalData = [
    ...main,
    ...(othersTotal > 0
      ? [{ name: "Others", value: othersTotal }]
      : []),
  ]

  const chartConfig = pieData.reduce(
    (acc, item) => {
      acc[item.name] = {
        label: item.name,
        color: item.fill,
      }
      return acc
    },
    {
      value: {
        label: "Movies",
      },
    }
  )

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Genres Distribution</CardTitle>
        <CardDescription>June - July 2025</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={finalData}
              dataKey="value"
              nameKey="name"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Top Genre of Movie Distribution
        </div>
      </CardFooter>
    </Card>
  )
}

