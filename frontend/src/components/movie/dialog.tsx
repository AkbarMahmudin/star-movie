import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {MovieForm} from "@/components/movie/form.tsx";
import type {Movie} from "@/interfaces/movie.ts";

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit" | "delete"
  defaultValues?: Movie | null
  onSuccess: () => void
}

export function MovieDialog({ open, onOpenChange, mode, defaultValues, onSuccess }: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            {mode} Movie
          </DialogTitle>
        </DialogHeader>

        <MovieForm
          mode={mode}
          defaultValues={defaultValues}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
