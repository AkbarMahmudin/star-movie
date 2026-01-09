import {movieSchema, type MovieFormValues} from "@/schemas/movie.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import useSWRMutation from "swr/mutation";
import {updateMovie, createMovie, deleteMovie} from "@/api/movie.ts";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {DialogClose} from "@/components/ui/dialog.tsx";
import type {Movie} from "@/interfaces/movie.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {ChevronDownIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";

interface GenreFormProps {
  mode: "add" | "edit" | "delete"
  defaultValues?: Movie | null
  onSuccess: () => void
}

export function MovieForm({
                            mode,
                            defaultValues,
                            onSuccess,
                          }: GenreFormProps) {
  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      overview: defaultValues?.overview ?? "",
      releaseDate: defaultValues?.releaseDate ?? "",
    },
  })

  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(defaultValues?.releaseDate ? new Date(defaultValues.releaseDate) : undefined);

  // Create
  const {trigger: create, isMutating: isCreating} = useSWRMutation(
    "http://localhost:3000/api/movies",
    createMovie
  )

  // Update
  const {trigger: update, isMutating: isUpdating} = useSWRMutation(
    defaultValues ? `http://localhost:3000/api/movies/${defaultValues.id}` : null,
    updateMovie
  )

  // Delete
  const {trigger: remove, isMutating: isDeleting} = useSWRMutation(
    defaultValues ? `http://localhost:3000/api/movies/${defaultValues.id}` : null,
    deleteMovie
  )

  const isLoading = isCreating || isUpdating || isDeleting

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      form.reset({
        title: defaultValues?.title ?? "",
        overview: defaultValues?.overview ?? "",
        releaseDate: defaultValues?.releaseDate ?? "",
      })
    }
  }, [mode, defaultValues, form])

  const onSubmit = async (values: MovieFormValues) => {
    console.log(values)
    try {
      switch (mode) {
        case "add":
          await create(values)
          break
        case "edit":
          await update(values)
          break
        case "delete":
          await remove()
          break
      }

      form.reset()
      onSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  const renderForm = mode !== "delete"
    ? (
      <>
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Overview</label>
          <Textarea {...form.register("overview")}>
            {form.formState.defaultValues?.overview}
          </Textarea>
          {form.formState.errors.overview && (
            <p className="text-sm text-destructive">
              {form.formState.errors.overview.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Release Date</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
              >
                {date ? date.toLocaleDateString() : "Select date"}
                <ChevronDownIcon/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (date) {
                    form.setValue('releaseDate', date.toString())
                  }
                  setDate(date)
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.releaseDate && (
            <p className="text-sm text-destructive">
              {form.formState.errors.releaseDate.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading
            ? "Saving..."
            : mode === "add"
              ? "Create"
              : "Update"}
        </Button>
      </>
    )
    : (
      <>
        <div className="space-y-1">
          <p className="font-bold text-destructive py-4">
            Are you sure you want to delete this genre?
          </p>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading
            ? "Deleting..."
            : "Delete"
          }
        </Button>

        <DialogClose asChild>
          <Button type="button" variant="secondary" className="w-full">
            Close
          </Button>
        </DialogClose>
      </>
    )

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {renderForm}
    </form>
  )
}