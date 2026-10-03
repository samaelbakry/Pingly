"use client";

import type { ReactElement } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UsersRound, ShieldCheck } from "lucide-react";

import { UserProfile } from "@/types/userProfile";

type GroupInfoDialogProps = {
  groupName: string;
  groupPhotoURL?: string;
  groupMembers: UserProfile[];
  adminId?: string;
  children: ReactElement;
};

export default function GroupInfoDialog({
  groupName,
  groupPhotoURL,
  groupMembers,
  adminId,
  children,
}: GroupInfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={children} />

      <DialogContent className="w-[calc(100%-2rem)] max-w-md chat-scroll overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/95 p-0 shadow-2xl backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="relative overflow-hidden border-b border-zinc-200/70 px-6 py-6 dark:border-zinc-800">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 flex items-center gap-4">
            <div>
              {groupPhotoURL ? (
                <img
                  src={groupPhotoURL}
                  alt={groupName}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-violet-200 dark:ring-violet-500/20"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20">
                  <UsersRound className="h-7 w-7" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <DialogHeader className="text-left">
                <DialogTitle className="truncate text-lg font-bold text-zinc-900 dark:text-white">
                  {groupName}
                </DialogTitle>
              </DialogHeader>

              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                {groupMembers.length}{" "}
                {groupMembers.length === 1 ? "member" : "members"}
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-95 overflow-y-auto px-4 py-4">
          <div className="mb-3 flex items-center gap-2 px-2">
            <UsersRound className="h-4 w-4 text-violet-500" />

            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Group Members
            </p>
          </div>

          <div className="space-y-1.5">
            {groupMembers.map((member) => {
              const isAdmin = member.uid === adminId;

              return (
                <div
                  key={member.uid}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors ${
                    isAdmin
                      ? "bg-violet-50/80 dark:bg-violet-500/5"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Avatar className="h-10 w-10 shrink-0 rounded-xl">
                    <AvatarImage
                      src={member.photoURL || undefined}
                      alt={member.name}
                    />

                    <AvatarFallback className="rounded-xl bg-linear-to-br from-orange-400 to-amber-500 text-xs font-bold text-white">
                      {member.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                        {member.name || "Unknown User"}
                      </p>

                      {isAdmin && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-bold text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                          <ShieldCheck className="h-3 w-3" />
                          ADMIN
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 truncate text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                      {member.email ||
                        member.phoneNumber ||
                        "No contact info"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}