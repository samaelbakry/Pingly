"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, MessageCircle, Search } from "lucide-react";
import { getAllUsers } from "@/services/users";
import { UserProfile } from "@/types/userProfile";

type Props = {
  isNewChatOpen: boolean;
  setIsNewChatOpen: Dispatch<SetStateAction<boolean>>;
  currentUserId?: string;
  onSelectUser: (currentUserId: string, user: UserProfile) => void;
};

export default function AddNewChatDialog({
  isNewChatOpen,
  setIsNewChatOpen,
  currentUserId,
  onSelectUser,
}: Props) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isNewChatOpen) return;

    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        const otherUsers = data.filter((user) => user.uid !== currentUserId);
        setUsers(otherUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    loadUsers();
  }, [isNewChatOpen, currentUserId]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.phoneNumber?.includes(q),
    );
  }, [users, searchQuery]);

  const handleOpenChange = (open: boolean) => {
    setIsNewChatOpen(open);
    if (!open) setSearchQuery("");
  };

  return (
    <Dialog open={isNewChatOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-[2.5rem] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_-20px_rgba(249,115,22,0.35)] backdrop-blur-3xl sm:max-w-md dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-black/50">
        <DialogHeader className="space-y-2 px-1 text-left">
          <div className="relative mb-1 flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-linear-to-b from-orange-400 to-orange-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_20px_-6px_rgba(249,115,22,0.65)]">
            <span className="pointer-events-none absolute inset-x-1 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/30 to-transparent" />
            <MessageCircle className="relative h-5 w-5 drop-shadow-sm" />
          </div>
          <DialogTitle className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            New Chat
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Choose a user to start a new conversation.
          </DialogDescription>
        </DialogHeader>

        {users.length > 4 && (
          <div className="relative mt-4">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400 dark:text-orange-300/70" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="h-10 rounded-full border-orange-100 bg-orange-50/40 pl-10 pr-3 text-xs text-zinc-700 transition-all focus-visible:ring-2 focus-visible:ring-orange-500/40 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
            />
          </div>
        )}

        <div className="chat-scroll mt-4 max-h-[60vh] space-y-1.5 overflow-y-auto pr-0.5">
          {filteredUsers.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center p-4 text-center">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                {users.length === 0
                  ? "No users available"
                  : "No matching users found"}
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user.uid}
                type="button"
                onClick={() => {
                  if (!currentUserId) return;

                  onSelectUser(currentUserId, user);
                  handleOpenChange(false);
                }}
                className="group flex w-full items-center gap-3.5 rounded-2xl border border-transparent px-3 py-2.5 text-left transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-orange-200 hover:bg-orange-50/70 active:scale-[0.98] active:bg-orange-100/80 dark:hover:border-orange-400/20 dark:hover:bg-orange-500/10 dark:active:bg-orange-500/20"
              >
                <Avatar className="h-11 w-11 border border-white/80 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 dark:border-zinc-700">
                  <AvatarImage src={user.photoURL} alt={user.name || "User"} />
                  <AvatarFallback className="bg-linear-to-b from-orange-400 to-orange-600 text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {user.name || "Unknown User"}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    {user.email || user.phoneNumber || "No contact info"}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 -translate-x-1 text-orange-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 dark:text-orange-300" />
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
