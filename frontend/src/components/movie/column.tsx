import {type ColumnDef} from "@tanstack/react-table"
import {MoreHorizontal} from "lucide-react"
import {Button} from "@/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {formatDistance, format} from 'date-fns'
import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header.tsx";
import type {Movie} from "@/interfaces/movie.ts";

export const columns: (onEditClick: any, onDeleteClick: any) => ColumnDef<Movie>[] = (onEditClick, onDeleteClick) => ([
  {
    accessorKey: "title",
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Title"/>
    )
  },
  {
    accessorKey: "releaseDate",
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Release"/>
    ),
    cell: ({row}) => {
      const releaseDate: Date = row?.getValue("releaseDate") ?? '';
      const formatted = format(releaseDate, "MMM dd, yyyy");

      return <div className="italic font-light text-muted-foreground">{formatted}</div>
    },
  },
  {
    accessorKey: "lastSyncAt",
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Last Sync"/>
    ),
    cell: ({row}) => {
      const lastSyncAt: Date = row?.getValue("lastSyncAt") ?? '';
      const formatted = lastSyncAt ? formatDistance(lastSyncAt, new Date()) : 'Not sync';

      return <div className="italic font-light text-muted-foreground capitalize">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({row}) => <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => onEditClick?.(row.original)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDeleteClick?.(row.original)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  },
])