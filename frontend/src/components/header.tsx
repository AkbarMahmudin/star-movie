import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {RefreshCw} from "lucide-react";
import type {MouseEventHandler} from "react";

interface HeaderProps {
  title?: string;
  description?: string;
  onSync?: MouseEventHandler
  isSyncing?: boolean;
}

export const Header = ({
  title = 'Dashboard',
  description = 'Manage your data and view analytics',
  onSync,
  isSyncing = false,
}: HeaderProps) => {
  // const { mutate: sync, isPending: isSyncing } = useSyncData();

  return (
    <header className="border-y border-border px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {onSync && (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={onSync}
              disabled={isSyncing}
              className="gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
              {isSyncing ? 'Syncing...' : 'Sync Data'}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
