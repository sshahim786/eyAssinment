import { useQuery } from '@tanstack/react-query'
import { fetchCharacters } from '../api/rickApi'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { throttle } from 'lodash'

type Character = {
  id: number
  name: string
  status: string
  species: string
  image: string
}

type CharacterResponse = {
  info: {
    count: number
    pages: number
    next: string | null
    prev: string | null
  }
  results: Character[]
}

const CharactersPage = () => {
  const navigate = useNavigate()
  const search = useSearch<{ page?: string }>({ strict: false })
  const page = parseInt(search.page ?? '1')

  const { data, isLoading, isError, refetch } = useQuery<CharacterResponse>({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
    placeholderData: (prev) => prev,
  })

  // Throttle the refetch function to prevent excessive API calls
  const throttledRefetch = useMemo(() => throttle(refetch, 3000), [refetch])

  const columns = useMemo<ColumnDef<Character>[]>(() => [
    {
      header: 'Image',
      accessorKey: 'image',
      cell: (info) => (
        <img src={info.getValue() as string} alt="" width={50} />
      ),
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
    {
      header: 'Species',
      accessorKey: 'species',
    },
    {
      header: 'Details',
      cell: (info) => {
        const character = info.row.original
        return (
          <button
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() =>
              navigate({ to: `/character/${character.id}` })
            }
          >
            View
          </button>
        )
      },
    },
  ], [navigate])

  const table = useReactTable({
    data: data?.results ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <p>Loading characters...</p>
  if (isError) return <p>Error fetching characters.</p>

  const totalPages = data?.info?.pages

  return (
    <div className="p-4 flex flex-col items-center">
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <h2 className="text-2xl font-bold mb-4">Characters</h2>

        <button
          onClick={throttledRefetch}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🔄 Refresh
        </button>
      </div>

      <div>
        <table style={{ width: '100%', maxWidth: '1200px', overflowX: 'auto', border: '1px solid #ddd' }} className="w-full">
          <thead style={{ backgroundColor: '#EC9900', color: '#333' }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border px-3 py-2 bg-gray-100 font-semibold"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody style={{ backgroundColor: '#EC9900', color: '#333' }}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-4 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <button
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => navigate({ to: '/', search: { page: `${page - 1}` } })}
        >
          ◀ Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => navigate({ to: '/', search: { page: `${page + 1}` } })}
        >
          Next ▶
        </button>
      </div>
    </div>
  )
}

export default CharactersPage
