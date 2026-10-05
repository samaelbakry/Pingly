"use client";

import { deleteMsg } from "@/services/messages";
import { Message } from "@/types/messages";
import { Reply, Trash2 } from "lucide-react";

type Props = {
  message: Message;
  chatId: string;
  isMine: boolean;
  onReply: (message: Message) => void;
};

export default function MessageActions({
  message,
  chatId,
  isMine,
  onReply,
}: Props) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onReply(message)}
        aria-label="Reply to message"
        className="
          rounded-full p-2
          text-slate-300
          opacity-0
          transition-all duration-200
          hover:bg-orange-50
          hover:text-orange-400
          group-hover/message:opacity-100
          dark:text-slate-600
          dark:hover:bg-orange-400/10
          dark:hover:text-orange-300
        "
      >
        <Reply className="h-3.5 w-3.5" />
      </button>

      {isMine && (
        <button
          type="button"
          onClick={() => deleteMsg(chatId, message.id)}
          aria-label="Delete message"
          className="
            rounded-full p-2
            text-slate-300
            opacity-0
            transition-all duration-200
            hover:bg-rose-50
            hover:text-rose-300
            group-hover/message:opacity-100
            dark:text-slate-600
            dark:hover:bg-rose-400/10
            dark:hover:text-rose-300
          "
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}