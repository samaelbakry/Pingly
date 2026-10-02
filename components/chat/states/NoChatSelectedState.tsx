import Logo from "@/components/ui/Logo";
import { MessageCircle } from "lucide-react";

export default function NoChatSelectedState() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/60 p-8 text-center shadow-2xl shadow-orange-500/5 dark:shadow-none backdrop-blur-3xl">
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-linear-to-br from-amber-400/15 via-orange-500/10 to-rose-500/15 dark:from-amber-500/10 dark:via-orange-600/5 dark:to-rose-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-linear-to-tr from-violet-500/10 via-rose-400/15 to-orange-400/15 dark:from-violet-600/5 dark:via-rose-600/10 dark:to-orange-600/10 blur-[100px]" />

      <div className="relative z-10 flex max-w-sm flex-col items-center">
        <div className="group relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-linear-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 opacity-70 blur-xl transition-all duration-500 group-hover:opacity-100" />
          
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-200/50 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 shadow-lg shadow-zinc-900/5 backdrop-blur-md">
            <Logo />

          </div>
        </div>

        <h3 className="bg-linear-to-r from-zinc-900 via-orange-950 to-zinc-800 dark:from-zinc-100 dark:via-orange-200 dark:to-zinc-300 bg-clip-text text-xl font-bold tracking-tight text-transparent">
          Select a conversation
        </h3>

        <p className="mt-2.5 max-w-65 text-xs font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
          Choose a contact from the sidebar list to view messages and start chatting seamlessly
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-full border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/50 px-3 py-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 backdrop-blur-sm">
          <MessageCircle className="h-3.5 w-3.5 text-orange-500" />
          <span>Ready when you are</span>
        </div>
      </div>
    </div>
  );
}