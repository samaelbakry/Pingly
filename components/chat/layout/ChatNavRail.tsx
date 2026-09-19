"use client";
import { Archive, MessageCircle, Settings } from "lucide-react";
import { useState } from "react";

export default function ChatNavRail() {
  const [activeTab, setActiveTab] = useState<"chats" | "archive" | "settings">("chats");
  const navItems = [
    { id: "chats", label: "Chats", icon: MessageCircle },
    { id: "archive", label: "Archive", icon: Archive },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <aside className="hidden sm:flex flex-col items-center justify-between py-4 w-18 h-full bg-white/60 dark:bg-zinc-900/60 border border-white/80 dark:border-zinc-800/80 backdrop-blur-xl rounded-4xl shadow-sm shrink-0">
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              type="button"
              className={`relative group flex items-center justify-center size-9 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100"
              }`}
            >
              <Icon className="size-5 transition-transform group-hover:scale-110" />
            </button>
          );
        })}
      </div>

      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
        U
      </div>
    </aside>
  );
}