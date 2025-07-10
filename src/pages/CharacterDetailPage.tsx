import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

type Character = {
  id: number
  name: string
  status: string
  species: string
  gender: string
  image: string
  origin: { name: string }
  location: { name: string }
}

const fetchCharacterById = async (id: string) => {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`)
  if (!res.ok) throw new Error('Failed to fetch character')
  return res.json()
}

const CharacterDetailPage = () => {
  const params = useParams({ from: '/character/$id' })
  const { data, isLoading, isError } = useQuery<Character>({
    queryKey: ['character', params.id],
    queryFn: () => fetchCharacterById(params.id),
  })

  if (isLoading) return <p>Loading character...</p>
  if (isError || !data) return <p>Error loading character details.</p>

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem'}}>
      <img src={data.image} alt={data.name} className="w-32 h-32 mx-auto rounded-full" />
      <h2 className="text-2xl text-center mt-4 font-bold">{data.name}</h2>
      <p className="text-center mt-2">Status: {data.status}</p>
      <p className="text-center">Species: {data.species}</p>
      <p className="text-center">Gender: {data.gender}</p>
      <p className="text-center">Origin: {data.origin.name}</p>
      <p className="text-center">Last known location: {data.location.name}</p>
    </div>
  )
}

export default CharacterDetailPage
