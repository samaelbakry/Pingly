"use client";

import { Input } from "@base-ui/react";
import { Search, Sparkles, UsersRound } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ChatItem } from "@/types/chatType";

export default function SidebarHeader({
  userChats,
  search,
  setSearch,
}: {
  userChats: ChatItem[];
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) {
  const groupCount = userChats.filter(
    (chat) => chat.type === "group",
  ).length;

  return (
    <header className="relative z-10 px-2 pb-4 pt-2">
     
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/20">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-[15px] font-bold tracking-tight text-zinc-900 dark:text-white">
                Conversations
              </h2>

              <p className="mt-0.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                Stay connected
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-orange-200/70 bg-orange-50/80 px-2.5 py-1.5 dark:border-orange-500/10 dark:bg-orange-500/5">
          <UsersRound className="h-3 w-3 text-orange-500" />

          <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
            {userChats.length}
          </span>

          {groupCount > 0 && (
            <>
              <span className="h-3 w-px bg-orange-200 dark:bg-orange-500/20" />

              <span className="text-[10px] font-semibold text-violet-500 dark:text-violet-400">
                {groupCount} groups
              </span>
            </>
          )}
        </div>
      </div>

      <div className="group relative mt-4">
        <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
          <Search className="h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-orange-500 dark:text-zinc-500" />
        </div>

        <Input
          placeholder="Search people or groups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-2xl border border-zinc-200/80 bg-zinc-50/80 pl-10 pr-4 text-xs font-medium text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-orange-200 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:hover:border-zinc-700 dark:focus:border-orange-500 dark:focus:bg-zinc-900"
        />
      </div>
    </header>
  );
}