import { Search } from "lucide-react";

export default function NoMatchingChats() {
  return (
    <div className="flex h-48 flex-col items-center justify-center p-4 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 backdrop-blur-md">
        <Search className="h-5 w-5 text-orange-500 dark:text-orange-400" />
      </div>

      <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
        No conversations yet
      </p>

      <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
        Start a new chat to begin messaging
      </p>
    </div>
  );
}
