import { z } from "zod"

export const genreSchema = z.object({
  name: z.string().min(1, "Name is required"),
})

export type GenreFormValues = z.infer<typeof genreSchema>
