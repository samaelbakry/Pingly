
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { ChatListCardProps } from "@/types/Props";
import { useUserPrivacySettings } from "@/hooks/privacy/PrivacyVisibilitySettings/useUserPrivacySettings";

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

type GroupParticipantAvatarProps = {
  user: ChatUser;
  position: "first" | "second";
};

function GroupParticipantAvatar({user,position}: GroupParticipantAvatarProps) {
  const { settings: privacy } = useUserPrivacySettings(user.uid);

  const canShowPhoto = privacy?.profilePhoto === "everyone";
  const isFirst = position === "first";

  return (
    <Avatar
      className={`absolute ${
        isFirst ? "left-0 top-0" : "bottom-0 right-0"
      } h-8 w-8 rounded-xl border-2 border-white shadow-md dark:border-zinc-950`}
    >
      <AvatarImage
        src={canShowPhoto ? user.photoURL || undefined : undefined}
        alt={user.name || "Member"}
        className="rounded-xl object-cover"
      />

      <AvatarFallback
        className={`rounded-xl text-[10px] font-bold text-white ${
          isFirst
            ? "bg-linear-to-br from-violet-500 to-purple-600"
            : "bg-linear-to-br from-orange-400 to-amber-500"
        }`}
      >
        {user.name?.charAt(0).toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  );
}

export default function ChatListAvatar({
  isGroup,
  groupName,
  groupPhotoURL,
  groupParticipants,
  otherUser,
}: ChatListAvatarProps) {
  const { settings: otherUserPrivacy } = useUserPrivacySettings(
    !isGroup ? otherUser?.uid : undefined,
  );

  const canShowOtherUserPhoto = otherUserPrivacy?.profilePhoto === "everyone";

  if (!isGroup) {
    return (
      <Avatar className="h-11 w-11 shrink-0 rounded-2xl border-2 border-white shadow-md dark:border-zinc-900">
        <AvatarImage
          src={
            canShowOtherUserPhoto
              ? otherUser?.photoURL || undefined
              : undefined
          }
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
        <GroupParticipantAvatar
          user={groupParticipants[0]}
          position="first"
        />

        <GroupParticipantAvatar
          user={groupParticipants[1]}
          position="second"
        />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-200 bg-linear-to-br from-violet-500/15 to-purple-500/20 text-violet-600 dark:border-violet-500/20 dark:text-violet-400">
      <Users className="h-5 w-5" />
    </div>
  );
}
