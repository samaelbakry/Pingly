"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
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
      <DialogContent className="max-w-md sm:max-w-lg p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Add members
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-zinc-400">
              <Loader2 className="size-6 animate-spin text-violet-500" />
              <p className="text-xs">Loading available users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <p className="text-sm font-medium">No users available</p>
              <p className="text-xs text-zinc-400 mt-1">
                There are no more users to add to this group.
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.uid}
                className="flex items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="size-10 border border-zinc-200 dark:border-zinc-700/50">
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 font-medium text-xs">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleAddMember(user.uid)}
                  disabled={addingUserId === user.uid}
                  className="bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-600 dark:hover:bg-violet-500 transition-all shadow-sm cursor-pointer disabled:opacity-50 min-w-17.5"
                >
                  {addingUserId === user.uid ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
