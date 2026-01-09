import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {GenreForm} from "@/components/genre/form.tsx";
import type {Genre} from "@/interfaces/genre.ts";

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit" | "delete"
  defaultValues?: Genre | null
  onSuccess: () => void
}

export function GenreDialog({ open, onOpenChange, mode, defaultValues, onSuccess }: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            {mode} Genre
          </DialogTitle>
        </DialogHeader>

        <GenreForm
          mode={mode}
          defaultValues={defaultValues}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
