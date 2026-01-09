import { z } from "zod"

export const movieSchema = z.object({
  title: z.string().min(10),
  overview: z.string().min(50),
  releaseDate: z.string(),
})

export type MovieFormValues = z.infer<typeof movieSchema>
