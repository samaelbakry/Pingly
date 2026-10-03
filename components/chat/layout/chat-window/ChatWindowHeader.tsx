"use client";
import { getUserById } from "@/services/users";
import { chatWindowProps } from "@/types/Props";
import { UserProfile } from "@/types/userProfile";
import { useEffect, useState } from "react";
import ChatProfileAvatar from "../ChatProfileAvatar";
import ChatWindowHeaderDropdown from "./ChatWindowHeaderDropdown";

export default function ChatWindowHeader({
  selectedUser,
  selectedGroup,
  isGroupChat,
  messages,
  chatId,
  currentUserId,
  handleLeaveChat,
}: chatWindowProps) {
  const [groupMembers, setGroupMembers] = useState<UserProfile[]>([]);

  const isGroupCreator =
    isGroupChat && selectedGroup?.createdBy === currentUserId;

  useEffect(() => {
    if (!isGroupChat || !selectedGroup?.participants) {
      return;
    }

    const loadGroupMembers = async () => {
      try {
        const memberIds = Object.keys(selectedGroup.participants);

        const members = await Promise.all(
          memberIds.map((id) => getUserById(id)),
        );

        setGroupMembers(
          members.filter((member): member is UserProfile => member !== null),
        );
      } catch (error) {
        console.error("Failed to load group members:", error);
      }
    };

    loadGroupMembers();
  }, [isGroupChat, selectedGroup]);
  return (
    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-800/80 px-6 py-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl supports-backdrop-filter:bg-white/60 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3.5">
        <ChatProfileAvatar
          selectedGroup={selectedGroup}
          selectedUser={selectedUser}
          isGroupChat={isGroupChat}
          groupMembers={groupMembers}
        />
        
      </div>

      <ChatWindowHeaderDropdown
        messages={messages}
        chatId={chatId}
        currentUserId={currentUserId}
        isGroupCreator={isGroupCreator}
        selectedGroup={selectedGroup}
        isGroupChat={isGroupChat}
        handleLeaveChat={handleLeaveChat}
      />
    </div>
  );
}
