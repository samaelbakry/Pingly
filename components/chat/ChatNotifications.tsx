"use client";

import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/userProfile";

type Props = {
  user: UserProfile;
  message: string;
  onClose: () => void;
};

export default function ChatNotification({ user, message, onClose }: Props) {
  return (
    <div className="fixed right-5 top-20 z-9999 flex w-85 items-start gap-3 rounded-[2rem] border border-white/60 bg-white/70 p-4 shadow-2xl shadow-orange-500/15 backdrop-blur-3xl animate-in fade-in slide-in-from-top-5 duration-200">
      <Avatar className="h-11 w-11 shrink-0 border border-white/60 shadow-xs">
        <AvatarImage
          src={user.photoURL || ""}
          alt={user.name || "User"}
        />

        <AvatarFallback className="bg-linear-to-tr from-amber-400 to-orange-500 font-bold text-white">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-800">
          {user.name || "New message"}
        </p>

        <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white/60 hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}