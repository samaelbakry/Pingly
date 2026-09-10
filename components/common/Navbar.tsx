"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { LogOut, User, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-3xl bg-white/30 border-b border-white/40 shadow-[0_4px_24px_0_rgba(249,115,22,0.04)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo withText={true} />
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-700">
                  {user.displayName || user.email}
                </span>

                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="relative h-10 w-10 rounded-full overflow-hidden border border-white/60 bg-white/40 flex items-center justify-center text-orange-700 font-semibold shadow-xs hover:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 backdrop-blur-md transition-all"
                  aria-expanded={dropdownOpen}
                  aria-label="User menu"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />
                  ) : (
                    getInitials(user.displayName)
                  )}
                </button>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-[2rem] bg-white/70 shadow-2xl border border-white/60 py-2 z-50 backdrop-blur-3xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-white/40 sm:hidden">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {user.displayName || "Account"}
                    </p>
                    <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-white/60 hover:text-orange-600 transition-colors mx-1.5 rounded-xl"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile settings</span>
                  </Link>

                  {logout && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50/50 transition-colors mx-1.5 rounded-xl mt-0.5"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center px-4 py-2 rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-red-500 hover:opacity-95 active:scale-95 text-white shadow-lg shadow-orange-500/20 text-xs font-bold transition-all"
              >
                <LogIn className="w-4 h-4 mr-1.5 stroke-[2.5]" />
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}