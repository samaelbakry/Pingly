import Logo from "@/components/ui/Logo";
import { Sparkles } from "lucide-react";

export default function NoChatSelectedState() {
  return (
    <>
      <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-8 text-center shadow-xl shadow-orange-500/5 dark:shadow-none backdrop-blur-2xl">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-linear-to-br from-amber-300/20 to-orange-400/20 dark:from-amber-600/10 dark:to-orange-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-linear-to-tr from-rose-400/20 to-orange-300/20 dark:from-rose-600/10 dark:to-orange-600/10 blur-3xl" />

        <div className="relative z-10 flex max-w-xs flex-col items-center">
          <div className="relative mb-2">
            <Logo />
            <Sparkles className="absolute -top-1 -right-3 h-4 w-4 animate-pulse text-amber-500 dark:text-amber-400" />
          </div>

          <h3 className="mt-3 bg-linear-to-r from-orange-600 via-red-500 to-rose-600 dark:from-orange-400 dark:via-red-400 dark:to-rose-400 bg-clip-text text-xl font-black tracking-tight text-transparent">
            Select a conversation
          </h3>

          <p className="mt-2 text-xs font-medium leading-relaxed text-slate-400 dark:text-zinc-500">
            Choose a contact from the sidebar list to view messages and start
            chatting
          </p>
        </div>
      </div>
    </>
  );
}
