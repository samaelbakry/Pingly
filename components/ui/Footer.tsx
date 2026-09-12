
export default function Footer() {
  return (
    <footer className="relative z-10 py-8 border-t border-orange-100 dark:border-zinc-800/80 text-center text-xs text-slate-400 dark:text-zinc-500 bg-amber-50/20 dark:bg-zinc-950/40 backdrop-blur-md">
      © {new Date().getFullYear()} Pingly. Crafting warm connections everywhere.
    </footer>
  );
}