"use client";

import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import AddNewChatDialog from "./AddNewChatDialog";
import { useState } from "react";
import { UserProfile } from "@/types/userProfile";
import CreateGroupDialog from "./CreateGroupDialog";

export default function ChatSidebarFooter({
  currentUserId,
  handleSelectChat,
  onCreateGroup,
}: {
  currentUserId: string;
  handleSelectChat: (currentUserID: string, user: UserProfile) => Promise<void>;
  onCreateGroup: (groupName: string, membersIds: string[]) => Promise<void>;
}) {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => setIsNewChatOpen(true)}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:opacity-95 hover:shadow-orange-500/30 active:scale-[0.99] dark:shadow-none"
        >
          <Plus className="h-4 w-4 stroke-3" />
          New Chat
        </Button>

        <Button
          type="button"
          onClick={() => setIsCreateGroupOpen(true)}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:opacity-95 active:scale-[0.99] dark:shadow-none"
        >
          <Users className="h-4 w-4" />
          New Group
        </Button>
      </div>
      <AddNewChatDialog
        isNewChatOpen={isNewChatOpen}
        setIsNewChatOpen={setIsNewChatOpen}
        currentUserId={currentUserId}
        onSelectUser={handleSelectChat}
      />
      <CreateGroupDialog
        isCreateGroupOpen={isCreateGroupOpen}
        setIsCreateGroupOpen={setIsCreateGroupOpen}
        currentUserId={currentUserId}
        onCreateGroup={onCreateGroup}
      />
    </>
  );
}
