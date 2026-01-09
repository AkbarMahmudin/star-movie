import {Header} from "@/components/header.tsx";
import {DataTable} from "@/components/data-table/data-table.tsx";
import {columns} from "@/components/genre/column.tsx";
import useSWR from "swr";
import {useEffect, useState, type SetStateAction} from "react";
import {useDebounce} from "@/hooks/use-debounce.ts";
import {GenreDialog} from "@/components/genre/dialog.tsx";
import {findAllGenre, syncGenre} from "@/api/genre.ts";
import useSWRMutation from "swr/mutation";
import type {SortingState} from "@tanstack/react-table";

export default function Genre() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit' | 'delete'>("add")
  const [search, setSearch] = useState("")
  const [selectedGenre, setSelectedGenre] = useState(null)
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
    `http://localhost:3000/api/genres?${query.toString()}`,
    findAllGenre
  )

  const {trigger: sync, isMutating: isSyncing} = useSWRMutation(
    'http://localhost:3000/api/genres/sync',
    syncGenre
  );

  const handleAdd = () => {
    setMode("add")
    setSelectedGenre(null)
    setOpen(true)
  }

  const handleEdit = (genre: SetStateAction<null>) => {
    setMode("edit")
    setSelectedGenre(genre)
    setOpen(true)
  }

  const handleDelete = (genre: SetStateAction<null>) => {
    setMode("delete")
    setSelectedGenre(genre)
    setOpen(true)
  }

  const handleSync = async () => {
    await sync()
    await mutate()
  }

  return (
    <>
      <Header title="Genres" description="Manage your genres" onSync={handleSync} isSyncing={isSyncing}/>
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

        <GenreDialog
          open={open}
          onOpenChange={setOpen}
          mode={mode}
          defaultValues={selectedGenre}
          onSuccess={async () => {
            setOpen(false)
            await mutate() // SWR revalidate
          }}
        />
      </section>
    </>
  )
}

