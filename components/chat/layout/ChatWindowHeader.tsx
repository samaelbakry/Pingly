"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "@/services/users";
import { chatWindowProps } from "@/types/Props";
import { UserProfile } from "@/types/userProfile";
import { useEffect, useState } from "react";
import ClearChatButton from "../features/ClearChatButton";
import LeaveGroupButton from "../features/LeaveGroupButton";
import ArchiveButton from "../features/ArchiveButton";

export default function ChatWindowHeader({ selectedUser, selectedGroup, isGroupChat, messages, chatId, currentUserId }: chatWindowProps) {
  const [groupMembers, setGroupMembers] = useState<UserProfile[]>([]);

  const displayName = isGroupChat
    ? selectedGroup?.name || "Unnamed Group"
    : selectedUser?.name || "Unknown User";

  const displayPhoto = isGroupChat
    ? selectedGroup?.photoURL || ""
    : selectedUser?.photoURL || "";

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
    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 px-6 py-3.5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-slate-200 dark:border-zinc-700 shadow-xs">
          <AvatarImage src={displayPhoto} alt={displayName} />

          <AvatarFallback
            className={
              isGroupChat
                ? "bg-linear-to-tr from-violet-500 to-purple-600 font-bold text-white"
                : "bg-linear-to-tr from-amber-400 to-orange-500 font-bold text-white"
            }
          >
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-zinc-100">
            {displayName}
          </h2>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500 truncate max-w-60 sm:max-w-xs">
            {isGroupChat ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500/80 shrink-0"></span>
                <span className="truncate">
                  {groupMembers.map((member) => member.name).join(", ") ||
                    "No members"}
                </span>
              </span>
            ) : (
              <span>
                {messages.length}{" "}
                {messages.length === 1 ? "message" : "messages"}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {messages.length > 0 
        && <ClearChatButton chatId={chatId} />}

        <ArchiveButton chatId={chatId} currentUserId={currentUserId} />
        {isGroupChat && (
          <LeaveGroupButton userId={currentUserId} chatId={chatId} />)}
      </div>
    </div>
  );
}
