"use client";

import { Button } from "@/components/ui/button";
import { ArchiveRestore } from "lucide-react";
import { ChatListCardProps } from "@/types/Props";

type ChatListActionsProps = {
  chatId: string;
  onUnarchive: ChatListCardProps["onUnarchive"];
};

export default function ChatListActions({
  chatId,
  onUnarchive,
}: ChatListActionsProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => onUnarchive(chatId)}
      title="Unarchive chat"
      aria-label="Unarchive chat"
      className="mr-2 h-8 w-8 shrink-0 rounded-xl text-zinc-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-orange-500/10 hover:text-orange-500 dark:text-zinc-500 dark:hover:text-orange-400"
    >
      <ArchiveRestore className="h-3.5 w-3.5" />
    </Button>
  );
}