"use client";

import { Button } from "@/components/ui/button";
import { archiveChat } from "@/services/chatActions";
import { Archive } from "lucide-react";
import { toast } from "sonner";

export default function ArchiveButton({
  currentUserId,
  chatId,
}: {
  currentUserId: string;
  chatId: string;
}) {
  return (
    <Button
      onClick={() => {
        archiveChat(currentUserId, chatId);
        toast.success("Chat added to archive!");
      }}
      variant="ghost"
      size="sm"
      aria-label="Archive chat"
      className="
        w-full justify-start gap-2
        text-slate-600
        hover:bg-orange-50 hover:text-orange-600
        dark:text-zinc-300
        dark:hover:bg-orange-950/30 dark:hover:text-orange-400
      "
    >
      <Archive className="size-4 shrink-0" />
      <span>Archive Chat</span>
    </Button>
  );
}
