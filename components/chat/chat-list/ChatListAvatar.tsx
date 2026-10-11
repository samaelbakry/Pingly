"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { ChatListCardProps } from "@/types/Props";

type ChatUser = NonNullable<
  ChatListCardProps["chatUsers"][string]
>;

type ChatListAvatarProps = {
  isGroup: boolean;
  groupName?: string;
  groupPhotoURL?: string;
  groupParticipants: ChatUser[];
  otherUser?: ChatUser;
};

export default function ChatListAvatar({
  isGroup,
  groupName,
  groupPhotoURL,
  groupParticipants,
  otherUser,
}: ChatListAvatarProps) {
  if (!isGroup) {
    return (
      <Avatar className="h-11 w-11 shrink-0 rounded-2xl border-2 border-white shadow-md dark:border-zinc-900">
        <AvatarImage
          src={otherUser?.photoURL || undefined}
          alt={otherUser?.name || "User"}
          className="rounded-2xl object-cover"
        />
        <AvatarFallback className="rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 text-xs font-bold text-white">
          {otherUser?.name?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
    );
  }

  if (groupPhotoURL) {
    return (
      <Avatar className="h-11 w-11 shrink-0 rounded-2xl border-2 border-white shadow-md dark:border-zinc-900">
        <AvatarImage
          src={groupPhotoURL}
          alt={groupName || "Group"}
          className="h-full w-full rounded-2xl object-cover"
        />
        <AvatarFallback className="rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 text-xs font-bold text-white">
          {groupName?.charAt(0).toUpperCase() || "G"}
        </AvatarFallback>
      </Avatar>
    );
  }

  if (groupParticipants.length >= 2) {
    return (
      <div className="relative h-11 w-11 shrink-0">
        <Avatar className="absolute left-0 top-0 h-8 w-8 rounded-xl border-2 border-white shadow-md dark:border-zinc-950">
          <AvatarImage
            src={groupParticipants[0]?.photoURL || undefined}
            alt={groupParticipants[0]?.name || "Member"}
            className="rounded-xl object-cover"
          />
          <AvatarFallback className="rounded-xl bg-linear-to-br from-violet-500 to-purple-600 text-[10px] font-bold text-white">
            {groupParticipants[0]?.name?.charAt(0).toUpperCase() || "G"}
          </AvatarFallback>
        </Avatar>

        <Avatar className="absolute bottom-0 right-0 h-8 w-8 rounded-xl border-2 border-white shadow-md dark:border-zinc-950">
          <AvatarImage
            src={groupParticipants[1]?.photoURL || undefined}
            alt={groupParticipants[1]?.name || "Member"}
            className="rounded-xl object-cover"
          />
          <AvatarFallback className="rounded-xl bg-linear-to-br from-orange-400 to-amber-500 text-[10px] font-bold text-white">
            {groupParticipants[1]?.name?.charAt(0).toUpperCase() || "G"}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-200 bg-linear-to-br from-violet-500/15 to-purple-500/20 text-violet-600 dark:border-violet-500/20 dark:text-violet-400">
      <Users className="h-5 w-5" />
    </div>
  );
}