"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { archiveChat } from "@/services/chatActions";
import { Archive } from "lucide-react";
import ClearChatButton from "../features/ClearChatButton";
import { chatWindowProps } from "@/types/Props";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/userProfile";
import { getUserById } from "@/services/users";

export default function ChatWindowHeader({
  selectedUser,
  selectedGroup,
  isGroupChat,
  messages,
  chatId,
  currentUserId,
}: chatWindowProps) {
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
        {messages.length > 0 && <ClearChatButton chatId={chatId} />}
        <Button
          onClick={() => archiveChat(currentUserId, chatId)}
          variant="ghost"
          size="sm"
          aria-label="Archive chat"
          className="text-slate-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
        >
          <Archive className="size-4" />
        </Button>
      </div>
    </div>
  );
}
