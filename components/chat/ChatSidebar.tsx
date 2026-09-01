"use client";

import { Plus, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/context/AuthContext";
import { getAllUsers } from "@/services/users";
import { UserProfile } from "@/types/userProfile";
import ChatSkeleton from "../skeletons/ChatSkeleton";

export default function ChatSidebar() {
  const { user: currentUser } = useAuth();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);

        const data = await getAllUsers();

        const otherUsers = data.filter((user) => user.uid !== currentUser?.uid);
        console.log("Fetched users:", otherUsers);
        setUsers(otherUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.uid) {
      loadUsers();
    }
  }, [currentUser?.uid]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  return (
    <div className="relative flex flex-col h-full rounded-3xl border border-white/80 bg-white/70 p-4 shadow-xl shadow-orange-500/5 backdrop-blur-2xl">
      <div className="flex items-center justify-between pb-3.5 border-b border-orange-100/60">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              Messages
              <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
            </h2>

            <p className="text-[11px] font-semibold text-slate-400">
              {users.length} contacts available
            </p>
          </div>
        </div>
      </div>

      <div className="relative my-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded-2xl border-slate-200/80 bg-slate-50/70 pl-9 pr-4 text-xs placeholder:text-slate-400 focus-visible:border-orange-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-orange-500/10 transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 -mr-1 custom-scrollbar">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ChatSkeleton key={index} />
          ))
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-50 mb-3">
              <Search className="h-5 w-5 text-orange-400" />
            </div>

            <p className="text-xs font-semibold text-slate-500">
              No users found
            </p>

            <p className="text-[11px] text-slate-400 mt-1">
              Try searching for another name
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = selectedUserId === user.uid;

            return (
              <button
                key={user.uid}
                type="button"
                onClick={() => setSelectedUserId(user.uid)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 text-left cursor-pointer group relative ${
                  isSelected
                    ? "bg-linear-to-r from-orange-500/15 to-rose-500/10 border border-orange-300/50 shadow-xs"
                    : "hover:bg-slate-50/80 border border-transparent"
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-linear-to-b from-orange-500 to-rose-500" />
                )}

                <div className="relative shrink-0">
                  <Avatar className="h-11 w-11 border border-slate-200/60 shadow-xs group-hover:scale-105 transition-transform">
                    <AvatarImage src={user.photoURL} alt={user.name} />

                    <AvatarFallback className="bg-linear-to-tr from-amber-400 to-orange-500 text-white font-bold">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">
                      {user.name}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="pt-3 border-t border-orange-100/60 mt-2">
        <Button
          type="button"
          className="h-11 w-full rounded-2xl bg-linear-to-r from-amber-500 via-orange-500 to-red-500 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:opacity-95 hover:shadow-orange-500/30 active:scale-[0.99] flex items-center justify-center gap-2 text-xs"
        >
          <Plus className="h-4 w-4 stroke-3" />
          New Chat
        </Button>
      </div>
    </div>
  );
}
