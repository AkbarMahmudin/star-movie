import type {Genre} from "@/interfaces/genre.ts";
import {genreSchema, type GenreFormValues} from "@/schemas/genre.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import useSWRMutation from "swr/mutation";
import {createGenre, deleteGenre, updateGenre} from "@/api/genre.ts";
import {useEffect} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {DialogClose} from "@/components/ui/dialog.tsx";

interface GenreFormProps {
  mode: "add" | "edit" | "delete"
  defaultValues?: Genre | null
  onSuccess: () => void
}

export function GenreForm({
                            mode,
                            defaultValues,
                            onSuccess,
                          }: GenreFormProps) {
  const form = useForm<GenreFormValues>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
    },
  })

  // Create
  const {trigger: create, isMutating: isCreating} = useSWRMutation(
    "http://localhost:3000/api/genres",
    createGenre
  )

  // Update
  const {trigger: update, isMutating: isUpdating} = useSWRMutation(
    defaultValues ? `http://localhost:3000/api/genres/${defaultValues.id}` : null,
    updateGenre
  )

  // Delete
  const {trigger: remove, isMutating: isDeleting} = useSWRMutation(
    defaultValues ? `http://localhost:3000/api/genres/${defaultValues.id}` : null,
    deleteGenre
  )

  const isLoading = isCreating || isUpdating || isDeleting

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      form.reset({name: defaultValues.name})
    }
  }, [mode, defaultValues, form])

  const onSubmit = async (values: GenreFormValues) => {
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
        <div className="space-y-1">
          <label className="text-sm font-medium">Name</label>
          <Input {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
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