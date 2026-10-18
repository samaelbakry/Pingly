"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { addGroupMember } from "@/services/groupChatActions";
import { getAllUsers } from "@/services/users";
import { UserProfile } from "@/types/userProfile";

export default function AddMembersDialog({
  existingMemberIds,
  chatId,
  open,
  onOpenChange,
}: {
  existingMemberIds: string[];
  chatId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingUserId, setAddingUserId] = useState<string | null>(null);

  const handleAddMember = async (memberId: string) => {
    try {
      setAddingUserId(memberId);

      await addGroupMember(currentUser?.uid as string, chatId, memberId);

      setUsers((prev) => prev.filter((user) => user.uid !== memberId));
    } catch (error) {
      console.error("Failed to add group member:", error);
    } finally {
      setAddingUserId(null);
    }
  };

  useEffect(() => {
    if (!open) return;

    const loadUsers = async () => {
      try {
        setLoading(true);

        const allUsers = await getAllUsers();

        const availableUsers = allUsers.filter(
          (user) => !existingMemberIds.includes(user.uid),
        );

        setUsers(availableUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [open, existingMemberIds]);

  return (
   <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="rounded-[2.5rem] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_-20px_rgba(249,115,22,0.35)] backdrop-blur-3xl sm:max-w-md dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-black/50">
    <DialogHeader className="mb-4 space-y-2 px-1 text-left">
      <div className="relative mb-1 flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-linear-to-b from-orange-400 to-orange-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_20px_-6px_rgba(249,115,22,0.65)]">
        <span className="pointer-events-none absolute inset-x-1 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/30 to-transparent" />
        <UserPlus className="relative h-5 w-5 drop-shadow-sm" />
      </div>
      <DialogTitle className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Add members
      </DialogTitle>
    </DialogHeader>

    <div className="chat-scroll max-h-80 space-y-1.5 overflow-y-auto pr-1">
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-zinc-400">
          <Loader2 className="size-6 animate-spin text-orange-500" />
          <p className="text-xs font-medium">Loading available users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
          <p className="text-sm font-semibold">No users available</p>
          <p className="mt-1 text-xs font-medium text-zinc-400 dark:text-zinc-500">
            There are no more users to add to this group.
          </p>
        </div>
      ) : (
        users.map((user) => (
          <div
            key={user.uid}
            className="group flex items-center justify-between rounded-2xl border border-transparent p-2.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-orange-200 hover:bg-orange-50/70 dark:hover:border-orange-400/20 dark:hover:bg-orange-500/10"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-11 border border-white/80 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 dark:border-zinc-700">
                <AvatarImage src={user.photoURL} />
                <AvatarFallback className="bg-linear-to-b from-orange-400 to-orange-600 text-xs font-bold text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {user.name ? user.name : "Not provided"}
                </p>
                <p className="mt-0.5 truncate text-xs font-medium text-zinc-400 dark:text-zinc-500">
                  {user.email}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => handleAddMember(user.uid)}
              disabled={addingUserId === user.uid}
              className="group/btn relative h-9 min-w-17.5 cursor-pointer overflow-hidden rounded-full bg-linear-to-b from-orange-400 to-orange-600 px-4 text-[13px] font-semibold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.12),0_6px_14px_-4px_rgba(249,115,22,0.6)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-105 active:scale-95 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:active:scale-100"
            >
              <span className="pointer-events-none absolute inset-x-2 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/30 to-transparent" />
              <span className="relative flex items-center justify-center drop-shadow-sm">
                {addingUserId === user.uid ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Add"
                )}
              </span>
            </Button>
          </div>
        ))
      )}
    </div>
  </DialogContent>
</Dialog>
  );
}
