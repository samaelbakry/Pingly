"use client"
import { useUserPrivacySettings } from "@/hooks/privacy/PrivacyVisibilitySettings/useUserPrivacySettings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { NotificationItem } from "./Notifications";

type NotificationRowProps = {
  item: NotificationItem;
  onDismiss: (id: string) => void;
};

export default function NotificationRow({ item, onDismiss }: NotificationRowProps) {
  const { settings: privacy } = useUserPrivacySettings(item.user.uid);

  const canShowPhoto = privacy?.profilePhoto === "everyone";

  return (
    <div className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50">
      <Avatar className="h-10 w-10 shrink-0 rounded-xl">
        <AvatarImage
          src={canShowPhoto ? item.user.photoURL || undefined : undefined}
          alt={item.user.name || "User"}
          className="rounded-xl object-cover"
        />
        <AvatarFallback className="rounded-xl bg-linear-to-br from-orange-400 to-amber-500 text-xs font-bold text-white">
          {item.user.name?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
          {item.user.name || "Unknown user"}
        </p>

        <p className="mt-1 line-clamp-2 wrap-break-words text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {item.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 opacity-100 transition-colors hover:bg-white hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}