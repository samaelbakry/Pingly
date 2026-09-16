import Navbar from "@/components/common/Navbar";
import Footer from "@/components/ui/Footer";
import Logo from "@/components/ui/Logo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 selection:bg-orange-500 selection:text-white">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-124 w-200 -translate-x-1/2 rounded-full bg-linear-to-tr from-amber-300/40 via-orange-300/30 to-red-300/30 dark:from-amber-600/10 dark:via-orange-600/10 dark:to-red-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-100 w-100 rounded-full bg-rose-400/20 dark:bg-rose-600/10 blur-[120px]" />

      <header className="relative z-20 w-full shadow from-amber-500 via-orange-500 to-red-500 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 px-4 py-2 text-xs font-medium text-slate-600 dark:text-zinc-300 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-orange-500/30 hover:bg-orange-50/50 dark:hover:bg-zinc-800 hover:text-orange-600 dark:hover:text-orange-400 hover:shadow-md active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Back to home</span>
          </Link>
          <Logo withText={true} />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-linear-to-r from-amber-400/30 via-orange-400/30 to-red-400/30 dark:from-amber-600/20 dark:via-orange-600/20 dark:to-red-600/20 opacity-70 blur-md" />

          <div className="relative w-full rounded-3xl border border-white/80 dark:border-zinc-800 bg-white/85 dark:bg-zinc-900/85 p-6 shadow-xl shadow-orange-500/5 dark:shadow-none backdrop-blur-2xl sm:p-8">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}