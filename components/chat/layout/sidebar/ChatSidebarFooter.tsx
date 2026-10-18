"use client";

import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { UserProfile } from "@/types/userProfile";
import AddNewChatDialog from "../../dialogs/AddNewChatDialog";
import CreateGroupDialog from "../../dialogs/CreateGroupDialog";

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
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={() => setIsNewChatOpen(true)}
          className="group relative flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-b from-orange-400 to-orange-600 text-[13px] font-semibold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.12),0_8px_20px_-6px_rgba(249,115,22,0.65)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-105 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.12),0_12px_28px_-6px_rgba(249,115,22,0.75)] active:scale-95 active:brightness-95 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_20px_-8px_rgba(249,115,22,0.5)]"
        >
          <span className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/30 to-transparent" />
          <Plus className="relative h-4.5 w-4.5 stroke-[2.5] drop-shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-90" />
          <span className="relative drop-shadow-sm">New Chat</span>
        </Button>

        <Button
          type="button"
          onClick={() => setIsCreateGroupOpen(true)}
          className="group relative flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/50 bg-orange-500/10 text-[13px] font-semibold tracking-tight text-orange-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_14px_-4px_rgba(249,115,22,0.25)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-orange-500/20 active:scale-95 active:bg-orange-500/25 dark:border-white/10 dark:bg-orange-400/10 dark:text-orange-300 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] dark:hover:bg-orange-400/20"
        >
          <Users className="h-4.5 w-4.5 stroke-[2.25] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110" />
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
