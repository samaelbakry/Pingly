"use client";

import type { ChangeEvent } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";

import GroupInfoDialog from "../dialogs/GroupInfoDialog";
import { Edit, Loader } from "lucide-react";

type Props = {
  selectedGroup: ChatItem;
  groupMembers: UserProfile[];
  displayName: string;
  displayPhoto: string;
  canUpdateGroupPhoto: boolean;
  uploading: boolean;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function ChatGroupProfile({
  selectedGroup,
  groupMembers,
  displayName,
  displayPhoto,
  canUpdateGroupPhoto,
  uploading,
  onImageChange,
}: Props) {
  const inputId = `group-image-${selectedGroup.chatId}`;

  return (
    <div className="relative min-w-0 w-full">
      <GroupInfoDialog
        groupName={displayName}
        groupPhotoURL={displayPhoto}
        groupMembers={groupMembers}
        adminId={selectedGroup.createdBy}
      >
        <button
          type="button"
          className="
        group relative flex w-full min-w-0 items-center gap-3.5
        rounded-2xl border border-transparent p-2 text-left
        transition-all duration-300 ease-out
        hover:border-slate-200/80 hover:bg-slate-50/80 hover:shadow-xs
        dark:hover:border-zinc-800/80 dark:hover:bg-zinc-900/50
      "
        >
          <div className="relative shrink-0">
            <Avatar
              className="
            h-10 w-10 shrink-0 ring-2 ring-slate-200/80 shadow-xs
            transition-transform duration-300 ease-out group-hover:scale-105
            sm:h-11 sm:w-11
            dark:ring-zinc-800
          "
            >
              <AvatarImage
                src={displayPhoto || undefined}
                alt={displayName}
                className="object-cover"
              />

              <AvatarFallback className="bg-linear-to-tr from-indigo-600 via-violet-600 to-purple-500 text-xs font-bold tracking-wider text-white">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {canUpdateGroupPhoto && (
              <label
                htmlFor={inputId}
                title="Change group picture"
                onClick={(e) => e.stopPropagation()}
                className="
              absolute -bottom-1 -right-1 z-20 flex h-6 w-6
              cursor-pointer items-center justify-center rounded-full
              border-2 border-white bg-indigo-600 text-white shadow-md
              transition-all duration-200 hover:scale-110 hover:bg-indigo-700
              active:scale-95 dark:border-zinc-950 dark:bg-indigo-500 dark:hover:bg-indigo-400
            "
              >
                {uploading ? (
                  <Loader className="h-3 w-3 animate-spin text-white" />
                ) : (
                  <Edit className="h-3 w-3" />
                )}
              </label>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <h2 className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
              {displayName}
            </h2>

            <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">
              <span className="inline-flex shrink-0 items-center rounded-md bg-purple-50 px-1.5 py-0.5 text-[11px] font-semibold text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                {groupMembers.length}{" "}
                {groupMembers.length === 1 ? "member" : "members"}
              </span>

              <span className="shrink-0 text-slate-300 dark:text-zinc-700">
                •
              </span>

              <span
                className="min-w-0 flex-1 truncate text-slate-500 dark:text-zinc-400"
                title={groupMembers.map((member) => member.name).join(", ")}
              >
                {groupMembers.map((member) => member.name).join(", ") ||
                  "No members"}
              </span>
            </div>
          </div>
        </button>
      </GroupInfoDialog>

      {canUpdateGroupPhoto && (
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageChange}
          disabled={uploading}
        />
      )}
    </div>
  );
}
