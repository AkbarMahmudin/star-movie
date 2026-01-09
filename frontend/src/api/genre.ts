import axios from "axios"
import type {GenreFormValues} from "@/schemas/genre.ts";

export const findAllGenre = async (url: string) => {
  const res = await axios.get(url)
  return res.data
}

export const createGenre = async (
  url: string,
  {arg}: { arg: GenreFormValues }
) => {
  const res = await axios.post(url, arg)
  return res.data
}

export const updateGenre = async (
  url: string,
  {arg}: { arg: GenreFormValues }
) => {
  const res = await axios.patch(url, arg)
  return res.data
}

export const deleteGenre = async (url: string) => {
  const res = await axios.delete(url)
  return res.data
}

export const syncGenre = async (url: string) => {
  const res = await axios.post(url)
  return res.data
}
