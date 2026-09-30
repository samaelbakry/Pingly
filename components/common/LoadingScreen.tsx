
export default function LoadingScreen() {
  return (
    <section className="relative flex h-full min-h-0 items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/30 backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-orange-500" />
    </section>
  );
}
