import {
  type ColumnDef,
  type PaginationState,
  type OnChangeFn,
  flexRender,
  getCoreRowModel,
  useReactTable, type SortingState,
} from "@tanstack/react-table"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {DataTablePagination} from "@/components/data-table/data-table-pagination.tsx"
import {Skeleton} from "@/components/ui/skeleton.tsx"
import {Button} from "@/components/ui/button.tsx";
import {Plus, SearchIcon} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  total: number
  isLoading: boolean
  pagination: {
    pageIndex: number
    pageSize: number
  }
  onPaginationChange: OnChangeFn<PaginationState>
  search: string
  onSearchChange: (value: string) => void
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  onAddClick?: () => void
  onEditClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
                                           columns,
                                           data,
                                           total,
                                           isLoading,
                                           pagination,
                                           onPaginationChange,
                                           search,
                                           onSearchChange,
                                           sorting,
                                           onSortingChange,
                                           onAddClick,
                                         }: DataTableProps<TData, TValue>) {
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pagination.pageSize),
    manualPagination: true,
    manualSorting: true,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <div className="flex items-center justify-between py-4">
        <InputGroup className="max-w-sm">
          <InputGroupInput
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon/>
          </InputGroupAddon>
        </InputGroup>

        {onAddClick && (
          <Button onClick={onAddClick}>
            <Plus size={4}/>

            Add New
          </Button>
        )}
      </div>

      <div className="rounded-lg border overflow-hidden mb-4">
        <Table>
          <TableHeader className="bg-card">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({length: 5}).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({length: columns.length}).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full"/>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table}/>
    </>
  )
}