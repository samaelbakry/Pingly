"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  useEffect(() => {
    if (!isNewChatOpen) return;

    const loadUsers = async () => {
      try {
        const data = await getAllUsers();

        const otherUsers = data.filter(
          (user) => user.uid !== currentUserId
        );

        setUsers(otherUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    loadUsers();
  }, [isNewChatOpen, currentUserId]);

  return (
    <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
      <DialogContent
        className="
          rounded-[2.5rem]
          border border-white/40 dark:border-zinc-800
          bg-white/70 dark:bg-zinc-900/80
          p-6
          shadow-2xl dark:shadow-none
          backdrop-blur-3xl
          sm:max-w-md
        "
      >
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle
            className="
              text-base
              font-bold
              tracking-tight
              text-slate-800 dark:text-zinc-100
            "
          >
            New Chat
          </DialogTitle>

          <DialogDescription
            className="
              text-xs
              font-medium
              text-slate-400 dark:text-zinc-500
            "
          >
            Choose a user to start a new conversation.
          </DialogDescription>
        </DialogHeader>

        <div
          className="
            custom-scrollbar
            mt-4
            max-h-[60vh]
            space-y-1.5
            overflow-y-auto
            pr-1
          "
        >
          {users.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center p-4 text-center">
              <p
                className="
                  text-xs
                  font-semibold
                  text-slate-500 dark:text-zinc-400
                "
              >
                No users available
              </p>
            </div>
          ) : (
            users.map((user) => (
              <button
                key={user.uid}
                onClick={() => {
                  if (!currentUserId) return;

                  onSelectUser(currentUserId, user);
                  setIsNewChatOpen(false);
                }}
                type="button"
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-2xl
                  border border-transparent
                  p-3
                  text-left
                  backdrop-blur-md
                  transition-all
                  duration-200

                  hover:border-white/60
                  hover:bg-white/50
                  hover:shadow-xs

                  dark:hover:border-zinc-700
                  dark:hover:bg-zinc-800/60
                  dark:hover:shadow-none
                "
              >
                <Avatar
                  className="
                    h-11
                    w-11
                    border border-white/60 dark:border-zinc-700
                    shadow-xs
                  "
                >
                  <AvatarImage
                    src={user.photoURL}
                    alt={user.name || "User"}
                  />

                  <AvatarFallback
                    className="
                      bg-linear-to-tr
                      from-amber-400
                      to-orange-500
                      font-bold
                      text-white
                    "
                  >
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate
                      text-xs
                      font-semibold
                      text-slate-800 dark:text-zinc-100
                    "
                  >
                    {user.name || "Unknown User"}
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-[11px]
                      font-medium
                      text-slate-400 dark:text-zinc-500
                    "
                  >
                    {user.email ||
                      user.phoneNumber ||
                      "No contact info"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
