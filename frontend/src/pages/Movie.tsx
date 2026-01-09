import {Header} from "@/components/header.tsx";
import {type SetStateAction, useEffect, useState} from "react";
import type {SortingState} from "@tanstack/react-table";
import {useDebounce} from "@/hooks/use-debounce.ts";
import useSWR from "swr";
import {findAllMovie, syncMovie} from "@/api/movie.ts";
import useSWRMutation from "swr/mutation";
import {DataTable} from "@/components/data-table/data-table.tsx";
import {columns} from "@/components/movie/column.tsx";
import {MovieDialog} from "@/components/movie/dialog.tsx";

export default function Movie() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit' | 'delete'>("add")
  const [search, setSearch] = useState("")
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [sorting, setSorting] = useState<SortingState>([])

  const debouncedSearch = useDebounce(search, 500)
  const sort = sorting[0]

  // Reset page ketika search berubah (UX penting)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPagination((p) => ({...p, pageIndex: 0}))
  }, [debouncedSearch, sorting])

  const query = new URLSearchParams({
    page: String(pagination.pageIndex + 1),
    limit: String(pagination.pageSize),
    search: debouncedSearch,
  })

  if (sort) {
    query.append('orderBy', sort.id)
    query.append('order', sort.desc ? 'desc' : 'asc')
  }

  const {data, isLoading, mutate} = useSWR(
    `http://localhost:3000/api/movies?${query.toString()}`,
    findAllMovie
  )

  const {trigger: sync, isMutating: isSyncing} = useSWRMutation(
    'http://localhost:3000/api/movies/sync',
    syncMovie
  );

  const handleAdd = () => {
    setMode("add")
    setSelectedMovie(null)
    setOpen(true)
  }

  const handleEdit = (genre: SetStateAction<null>) => {
    setMode("edit")
    setSelectedMovie(genre)
    setOpen(true)
  }

  const handleDelete = (genre: SetStateAction<null>) => {
    setMode("delete")
    setSelectedMovie(genre)
    setOpen(true)
  }

  const handleSync = async () => {
    await sync()
    await mutate()
  }

  return (
    <>
      <Header title="Movies" description="Manage your movies" onSync={handleSync} isSyncing={isSyncing}/>
      <section className="px-6 py-4">
        <DataTable
          columns={columns(handleEdit, handleDelete)}
          data={data?.data ?? []}
          total={data?.meta?.totalRecordCount ?? 0}
          isLoading={isLoading}
          pagination={pagination}
          onPaginationChange={setPagination}
          search={search}
          onSearchChange={setSearch}
          sorting={sorting}
          onSortingChange={setSorting}
          onAddClick={handleAdd}
        />

        <MovieDialog
          open={open}
          onOpenChange={setOpen}
          mode={mode}
          defaultValues={selectedMovie}
          onSuccess={async () => {
            setOpen(false)
            await mutate() // SWR revalidate
          }}
        />
      </section>
    </>
  )
}