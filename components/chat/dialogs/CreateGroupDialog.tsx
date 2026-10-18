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

export default function CreateGroupDialog({
  isCreateGroupOpen,
  setIsCreateGroupOpen,
  currentUserId,
  onCreateGroup,
}: Props) {
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
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
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
    (user.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog open={isCreateGroupOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-[2.5rem] border border-white/60 bg-white/80 p-7 shadow-[0_30px_80px_-20px_rgba(249,115,22,0.35)] backdrop-blur-3xl sm:max-w-md dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-black/50">
        <DialogHeader className="space-y-2 text-left">
          <div className="relative mb-1 flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-linear-to-b from-orange-400 to-orange-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_20px_-6px_rgba(249,115,22,0.65)]">
            <span className="pointer-events-none absolute inset-x-1 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/30 to-transparent" />
            <Users className="relative h-5 w-5 drop-shadow-sm" />
          </div>
          <DialogTitle className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Create New Group
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Give your group a memorable name and choose members to start
            chatting.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 space-y-4">
          <Input
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="e.g. Design Team, Weekend Plans..."
            className="h-12 rounded-2xl border-orange-100 bg-orange-50/50 px-4 text-sm font-medium text-zinc-800 shadow-[inset_0_1px_2px_rgba(249,115,22,0.06)] transition-all placeholder:text-zinc-400 focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-500/40 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
          />

          {users.length > 4 && (
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400 dark:text-orange-300/70" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="h-10 rounded-full border-orange-100 bg-orange-50/40 pl-10 pr-3 text-xs text-zinc-700 transition-all focus-visible:ring-2 focus-visible:ring-orange-500/40 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
              />
            </div>
          )}

          <div className="chat-scroll max-h-[38vh] space-y-2 overflow-y-auto pr-1">
            {filteredUsers.length === 0 ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                  {users.length === 0
                    ? "No users available"
                    : "No matching users found"}
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
                    className={`group flex w-full items-center gap-3.5 rounded-2xl border p-3 text-left transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.98] ${
                      isSelected
                        ? "border-orange-400/60 bg-orange-500/10 shadow-[0_6px_16px_-8px_rgba(249,115,22,0.5)] dark:border-orange-400/40 dark:bg-orange-500/15"
                        : "border-zinc-200/60 bg-white/50 hover:border-orange-200 hover:bg-orange-50/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <Avatar className="h-11 w-11 border border-white/80 shadow-sm dark:border-zinc-700">
                      <AvatarImage
                        src={user.photoURL}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className="bg-linear-to-b from-orange-400 to-orange-600 text-xs font-bold text-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-zinc-800 dark:text-zinc-100">
                        {user.name || "Unknown User"}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                        {user.email || user.phoneNumber || "No contact info"}
                      </p>
                    </div>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        isSelected
                          ? "scale-110 border-orange-500 bg-linear-to-b from-orange-400 to-orange-600 text-white shadow-[0_4px_10px_-2px_rgba(249,115,22,0.6)]"
                          : "border-zinc-300 bg-transparent dark:border-zinc-600"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-3" />}
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
            className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-b from-orange-400 to-orange-600 text-[13px] font-semibold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.12),0_8px_20px_-6px_rgba(249,115,22,0.65)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-105 active:scale-95 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
          >
            <span className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/30 to-transparent" />
            <span className="relative drop-shadow-sm">Create Group</span>
            {selectedUsers.length > 0 && (
              <span className="relative rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm">
                {selectedUsers.length}
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
