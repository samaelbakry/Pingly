"use client";

import { Archive, MessageCircle, Settings } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";

interface ChatNavRailProps {
  setShowArchived: Dispatch<SetStateAction<boolean>>;
  showArchived: boolean;
}

export default function ChatNavRail({ showArchived = false, setShowArchived}: ChatNavRailProps) {
  const [activeTab, setActiveTab] = useState<"chats" | "settings">("chats");

  return (
    <aside className="hidden sm:flex flex-col items-center justify-between py-5 w-20 h-full bg-white/70 dark:bg-zinc-900/70 border border-white/90 dark:border-zinc-800/80 backdrop-blur-2xl rounded-4xl shadow-xl shadow-slate-900/5 shrink-0 transition-all duration-300">
      <div className="flex flex-col items-center gap-3 w-full px-3">
        <Link
          href="/chatDashboard"
          onClick={() =>{ setActiveTab("chats") ; setShowArchived(false) }}
          className={`relative group flex items-center justify-center size-11 rounded-2xl transition-all duration-300 ${
            activeTab === "chats" && !showArchived
              ? "bg-linear-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-105"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800/70 hover:text-slate-900 dark:hover:text-zinc-100"
          }`}
        >
          <MessageCircle className="size-5 transition-transform duration-300 group-hover:scale-110" />
          
        </Link>

        <button
          onClick={() => setShowArchived?.((prev) => !prev)}
          type="button"
          className={`relative group flex items-center justify-center size-11 rounded-2xl transition-all duration-300 ${
            showArchived
              ? "bg-linear-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-105"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800/70 hover:text-slate-900 dark:hover:text-zinc-100"
          }`}
        >
          <Archive className="size-5 transition-transform duration-300 group-hover:scale-110" />
         
        </button>

        <Link
          href="/settings"
          onClick={() => {
            setActiveTab("settings");
            setShowArchived?.(false);
          }}
          className={`relative group flex items-center justify-center size-11 rounded-2xl transition-all duration-300 ${
            activeTab === "settings" && !showArchived
              ? "bg-linear-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-105"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800/70 hover:text-slate-900 dark:hover:text-zinc-100"
          }`}
        >
          <Settings className="size-5 transition-transform duration-300 group-hover:rotate-45" />
         
        </Link>
      </div>

      <div className="relative group cursor-pointer">
        <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-500/20 ring-2 ring-white dark:ring-zinc-800 transition-transform duration-300 group-hover:scale-105">
          U
        </div>
      
      </div>
    </aside>
  );
}