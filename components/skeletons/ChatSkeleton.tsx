import { Skeleton } from "../ui/skeleton";

export default function ChatSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-transparent">
      <Skeleton className="h-11 w-11 rounded-full shrink-0 bg-slate-200/70" />

      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-28 bg-slate-200/70 rounded-md" />
        <Skeleton className="h-3 w-40 bg-slate-200/50 rounded-md" />
      </div>
    </div>
  );
}
