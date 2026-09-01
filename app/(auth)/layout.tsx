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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-800 selection:bg-orange-500 selection:text-white">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-124 w-200 -translate-x-1/2 rounded-full bg-linear-to-tr from-amber-300/40 via-orange-300/30 to-red-300/30 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-100 w-100 rounded-full bg-rose-400/20 blur-[120px]" />

      <header className="relative z-20 w-full shadow from-amber-500 via-orange-500 to-red-500 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
         <Logo withText={true} />

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:bg-orange-500/10 hover:text-slate-900 active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to home</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-linear-to-r from-amber-400/30 via-orange-400/30 to-red-400/30 opacity-70 blur-md" />

          <div className="relative w-full rounded-3xl border border-white/80 bg-white/85 p-6 shadow-xl shadow-orange-500/5 backdrop-blur-2xl sm:p-8">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
