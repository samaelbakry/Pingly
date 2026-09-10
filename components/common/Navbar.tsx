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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-amber-50/40 border-b border-orange-100/60 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo withText={true} />
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-sm font-medium text-slate-700">
                  {user.displayName || user.email}
                </span>

                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-orange-200 bg-orange-100 flex items-center justify-center text-orange-700 font-semibold shadow-xs hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
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
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-orange-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {user.displayName || "Account"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
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
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
                className="flex items-center px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-sm shadow-orange-500/20 text-sm font-medium transition-all"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}