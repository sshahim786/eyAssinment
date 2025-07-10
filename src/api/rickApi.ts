import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL

export const fetchCharacters = async (page: number = 1) => {
  const response = await axios.get(`${API_BASE}/character?page=${page}`)
  return response.data 
}
