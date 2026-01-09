export interface Movie {
  id: number
  title: string
  overview: string
  voteAvg: string
  voteCount: number
  popularity: string
  releaseDate?: string
  createdAt?: Date
  lastSyncAt?: Date
}
