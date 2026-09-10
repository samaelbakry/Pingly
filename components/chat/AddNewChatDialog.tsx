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
  onSelectUser: (currentUserId: string, otherUserId: string) => void;
};

export default function AddNewChatDialog({isNewChatOpen, setIsNewChatOpen , currentUserId , onSelectUser,}: Props) {
  const [users, setUsers] = useState<UserProfile[]>([]);

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
  return (
    <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>

          <DialogDescription>
            Choose a user to start a new conversation.
          </DialogDescription>
          <div className="mt-4 space-y-2">
            {users.map((user) => (
              <button
                key={user.uid}
                onClick={() => {
                  if (!currentUserId) return;

                  onSelectUser(currentUserId, user.uid);
                }}
                type="button"
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-orange-50"
              >
                <Avatar>
                  <AvatarImage src={user.photoURL} />

                  <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {user.name || "Unknown User"}
                  </p>

                  <p className="text-xs text-slate-400">
                    {user.email || user.phoneNumber || "No contact info"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
