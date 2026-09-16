"use client"
import { Input } from "@base-ui/react";
import { Search, Sparkles } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import AddToArchiveButton from "../features/AddToArchiveButton";
import { ChatItem } from "@/types/chatType";

export default function SidebarHeader({
  userChats,
  setShowArchived,
  showArchived,
  search,
  setSearch
}: {
  userChats: ChatItem[];
  setShowArchived: Dispatch<SetStateAction<boolean>>;
  showArchived: boolean;
  search:string;
  setSearch:Dispatch<SetStateAction<string>>
}) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-white/20 dark:border-zinc-800 pb-3.5 px-1 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md rounded-t-2xl">
        <div>
          <h2 className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-slate-800 dark:text-zinc-100">
            Messages
            <Sparkles className="h-3.5 w-3.5 fill-amber-500/20 text-amber-500 dark:text-amber-400" />
          </h2>

          <p className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 mt-0.5">
            {userChats.length} conversations
          </p>
        </div>
        <AddToArchiveButton
          setShowArchived={setShowArchived}
          showArchived={showArchived}
        />
      </div>

      <div className="relative my-3">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />

        <Input
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded-full border-white/40 dark:border-zinc-800 bg-white/40 dark:bg-zinc-800/60 pl-9 pr-4 text-xs text-slate-900 dark:text-zinc-100 backdrop-blur-md transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:border-orange-400 dark:focus-visible:border-orange-500 focus-visible:bg-white/60 dark:focus-visible:bg-zinc-800 focus-visible:ring-4 focus-visible:ring-orange-500/10 shadow-inner"
        />
      </div>
    </>
  );
}
