"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddNewChatDialog from "./AddNewChatDialog";
import { useState } from "react";
import { UserProfile } from "@/types/userProfile";

export default function AddNewChat({
  currentUserId,
  handleSelectChat,
}: {
  currentUserId: string;
  handleSelectChat: (currentUserID: string, user: UserProfile) => Promise<void>;
}) {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsNewChatOpen(true)}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-xs font-bold text-white shadow-lg shadow-orange-500/20 dark:shadow-none transition-all hover:opacity-95 hover:shadow-orange-500/30 active:scale-[0.99]"
      >
        <Plus className="h-4 w-4 stroke-3" />
        New Chat
      </Button>

      <AddNewChatDialog
        isNewChatOpen={isNewChatOpen}
        setIsNewChatOpen={setIsNewChatOpen}
        currentUserId={currentUserId}
        onSelectUser={handleSelectChat}
      />
    </>
  );
}
