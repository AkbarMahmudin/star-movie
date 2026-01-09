import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Item, ItemContent, ItemTitle} from "@/components/ui/item.tsx";

interface TopTableProps<TData extends Record<string, any>> {
  data: TData[]
  accessorKey: string;
  title?: string
  isLoading?: boolean;
}

export function TopTable<TData extends Record<string, any>>({
                                                              data,
                                                              accessorKey,
                                                              isLoading = false,
                                                              title = "",
                                                            }: TopTableProps<TData>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Skeleton className="h-30 w-full"/>
        ) : (
          <div className="flex w-full flex-col gap-1">
            {data?.map((item) => (
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>{item[accessorKey]}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
