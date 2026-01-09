import axios from "axios"

export const summary = async (url: string) => {
  const res = await axios.get(url)
  return res.data
}

export const genre = async (
  url: string,
) => {
  const res = await axios.get(url)
  return res.data
}

export const movie = async (
  url: string,
) => {
  const res = await axios.get(url)
  return res.data
}
