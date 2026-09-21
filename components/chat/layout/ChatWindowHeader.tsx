"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "@/services/users";
import { chatWindowProps } from "@/types/Props";
import { UserProfile } from "@/types/userProfile";
import { useEffect, useState } from "react";
import ClearChatButton from "../features/ClearChatButton";
import LeaveGroupButton from "../features/LeaveGroupButton";
import ArchiveButton from "../features/ArchiveButton";
import AddMembersDialog from "../features/AddMembersDialog";

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
        <div className="relative shrink-0">
          <Avatar className="h-11 w-11 border-2 border-white dark:border-zinc-900 shadow-md shadow-slate-900/5 ring-1 ring-slate-200/80 dark:ring-zinc-700/80 transition-transform duration-300 hover:scale-105">
            <AvatarImage src={displayPhoto} alt={displayName} className="object-cover" />

            <AvatarFallback
              className={
                isGroupChat
                  ? "bg-linear-to-br from-violet-500 via-purple-500 to-fuchsia-600 font-bold text-white text-sm tracking-wide"
                  : "bg-linear-to-br from-amber-400 via-orange-500 to-rose-500 font-bold text-white text-sm tracking-wide"
              }
            >
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {!isGroupChat && (
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-zinc-900 shadow-sm" />
          )}

          {isGroupChat && (
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-purple-600 border-2 border-white dark:border-zinc-900 shadow-sm">
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-white">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-zinc-50 leading-tight truncate">
            {displayName}
          </h2>
          <p className="mt-1 text-[11.5px] font-medium text-slate-400 dark:text-zinc-500 truncate max-w-60 sm:max-w-xs">
            {isGroupChat ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-500" />
                </span>
                <span className="truncate">
                  {groupMembers.map((member) => member.name).join(", ") ||
                    "No members"}
                </span>
              </span>
            ) : (
              <span className="tabular-nums">
                {messages.length}{" "}
                {messages.length === 1 ? "message" : "messages"}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {messages.length > 0 && (
          <div className="rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800">
            <ClearChatButton chatId={chatId} />
          </div>
        )}

        {isGroupCreator && selectedGroup && (
          <div className="rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800">
            <AddMembersDialog
              chatId={chatId}
              existingMemberIds={Object.keys(selectedGroup.participants)}
            />
          </div>
        )}

        <div className="rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800">
          <ArchiveButton chatId={chatId} currentUserId={currentUserId} />
        </div>

        {isGroupChat && (
          <>
            <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-zinc-700" />
            <div className="rounded-lg transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30">
              <LeaveGroupButton userId={currentUserId} chatId={chatId} />
            </div>
          </>
        )}
      </div>
    </div>

  );
}
