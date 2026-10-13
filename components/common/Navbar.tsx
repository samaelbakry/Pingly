"use client";

import Logo from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { user ,logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 w-full bg-amber-50/40 text-slate-800 shadow backdrop-blur-3xl transition-all dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo withText={true} />

        {!user && (
          <Link
            href="/login"
            className="flex items-center rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-red-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:opacity-95 active:scale-95"
          >
            <LogIn className="mr-1.5 h-4 w-4 stroke-[2.5]" />
            Log in
          </Link>
        )}
        {user && (
          <Link
            href="/verifyingOptions"
            onClick={logout}
            className="flex items-center rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-red-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:opacity-95 active:scale-95"
          >
            <LogOut className="mr-1.5 h-4 w-4 stroke-[2.5]" />
            Log out
          </Link>
        )}
      </div>
    </header>
  );
}
