"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllUsers } from "@/services/users";
import { UserProfile } from "@/types/userProfile";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Users, Check, Search } from "lucide-react";

type Props = {
  isCreateGroupOpen: boolean;
  setIsCreateGroupOpen: Dispatch<SetStateAction<boolean>>;
  currentUserId?: string;
  onCreateGroup: (groupName: string, membersIds: string[]) => void;
};

export default function CreateGroupDialog({ isCreateGroupOpen, setIsCreateGroupOpen, currentUserId, onCreateGroup }: Props) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isCreateGroupOpen) return;

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
  }, [isCreateGroupOpen, currentUserId]);

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) => prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      return;
    }

    onCreateGroup(groupName.trim(), selectedUsers);

    setGroupName("");
    setSelectedUsers([]);
    setSearchQuery("");
    setIsCreateGroupOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsCreateGroupOpen(open);

    if (!open) {
      setGroupName("");
      setSelectedUsers([]);
      setSearchQuery("");
    }
  };

  const filteredUsers = users.filter((user) =>
    (user.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isCreateGroupOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-[2.5rem] border border-white/60 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/90 p-7 shadow-2xl dark:shadow-black/50 backdrop-blur-3xl sm:max-w-md">
        <DialogHeader className="space-y-2 text-left">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 mb-1">
            <Users className="w-5 h-5" />
          </div>
          <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Create New Group
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-slate-500 dark:text-zinc-400">
            Give your group a memorable name and choose members to start chatting.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 space-y-4">
          <div className="relative">
            <Input
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="e.g. Design Team, Weekend Plans..."
              className="h-12 rounded-2xl border-slate-200/80 bg-white/60 dark:border-zinc-800 dark:bg-zinc-800/50 px-4 text-sm font-medium text-slate-800 dark:text-zinc-100 shadow-sm focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
            />
          </div>

          {users.length > 4 && (
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="h-10 rounded-xl border-slate-200/60 bg-slate-50/50 dark:border-zinc-800/60 dark:bg-zinc-900/40 pl-10 pr-3 text-xs text-slate-700 dark:text-zinc-300 transition-all"
              />
            </div>
          )}

          <div className="custom-scrollbar max-h-[38vh] space-y-2 overflow-y-auto pr-1">
            {filteredUsers.length === 0 ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500">
                  {users.length === 0 ? "No users available" : "No matching users found"}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.uid);

                return (
                  <button
                    key={user.uid}
                    type="button"
                    onClick={() => handleToggleUser(user.uid)}
                    className={`flex w-full items-center gap-3.5 rounded-2xl border p-3 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-purple-500/50 bg-purple-500/10 dark:border-purple-500/40 dark:bg-purple-500/15 shadow-sm"
                        : "border-slate-200/60 hover:border-slate-300 bg-white/40 hover:bg-white/80 dark:border-zinc-800 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <Avatar className="h-11 w-11 border border-white/80 shadow-sm dark:border-zinc-700">
                      <AvatarImage src={user.photoURL} alt={user.name || "User"} />
                      <AvatarFallback className="bg-linear-to-tr from-violet-500 to-purple-600 font-bold text-white text-xs">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-800 dark:text-zinc-100">
                        {user.name || "Unknown User"}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                        {user.email || user.phoneNumber || "No contact info"}
                      </p>
                    </div>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-all ${
                        isSelected
                          ? "border-purple-600 bg-purple-600 text-white shadow-sm shadow-purple-500/30 scale-105"
                          : "border-slate-300 dark:border-zinc-600 bg-transparent"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <Button
            type="button"
            disabled={!groupName.trim() || selectedUsers.length === 0}
            onClick={handleCreate}
            className="h-12 w-full rounded-2xl bg-linear-to-r from-violet-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create Group
            {selectedUsers.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
                {selectedUsers.length} selected
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}