"use client"
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
    <>
      <Button
        onClick={() => {
          archiveChat(currentUserId, chatId);
          toast.success("chat added to archive!");
        }}
        variant="ghost"
        size="sm"
        aria-label="Archive chat"
        className="text-slate-500 cursor-pointer hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
      >
        <Archive className="size-4" />
      </Button>
    </>
  );
}
