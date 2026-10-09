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
    <div
      className="
        flex
        min-w-0
        items-center
        justify-between
        gap-2
        border-b
        border-slate-200/60
        bg-white/80
        px-3
        py-3
        shadow-[0_1px_0_0_rgba(0,0,0,0.02)]
        backdrop-blur-2xl

        sm:gap-3
        sm:px-6
        sm:py-4

        dark:border-zinc-800/80
        dark:bg-zinc-900/80
      "
    >
      <div
        className="
          min-w-0
          flex-1
          overflow-hidden
        "
      >
        <ChatProfileAvatar
          selectedGroup={selectedGroup}
          selectedUser={selectedUser}
          isGroupChat={isGroupChat}
          groupMembers={groupMembers}
        />
      </div>

      <div className="shrink-0">
        <ChatWindowHeaderDropdown
          messages={messages}
          chatId={chatId}
          currentUserId={currentUserId}
          isGroupCreator={isGroupCreator}
          selectedGroup={selectedGroup}
          selectedUser={selectedUser}
          isGroupChat={isGroupChat}
          handleLeaveChat={handleLeaveChat}
        />
      </div>
    </div>
  );
}
