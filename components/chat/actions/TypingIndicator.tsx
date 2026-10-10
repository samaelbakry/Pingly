
export default function TypingIndicator() {
  return (
    <div className="mt-2 flex items-end gap-2.5">
      <div className="flex h-9 items-center gap-1 rounded-2xl rounded-bl-md border border-zinc-200/80 bg-white/90 px-3.5 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/90">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s] dark:bg-zinc-500" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s] dark:bg-zinc-500" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500" />
      </div>
    </div>
  );
}
