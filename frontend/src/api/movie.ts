import axios from "axios"
import type {MovieFormValues} from "@/schemas/movie.ts";

export const findAllMovie = async (url: string) => {
  const res = await axios.get(url)
  return res.data
}

export const createMovie = async (
  url: string,
  {arg}: { arg: MovieFormValues }
) => {
  const res = await axios.post(url, arg)
  return res.data
}

export const updateMovie = async (
  url: string,
  {arg}: { arg: MovieFormValues }
) => {
  const res = await axios.patch(url, arg)
  return res.data
}

export const deleteMovie = async (url: string) => {
  const res = await axios.delete(url)
  return res.data
}

export const syncMovie = async (url: string) => {
  const res = await axios.post(url)
  return res.data
}
