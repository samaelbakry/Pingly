"use client";

import { deleteMsg } from "@/services/messages";
import { Message } from "@/types/messages";
import { Reply, Trash2 } from "lucide-react";

type Props = {
  message: Message;
  chatId: string;
  isMine: boolean;
  onReply: (message: Message) => void;
  showActions: boolean;
};

export default function MessageActions({
  message,
  chatId,
  isMine,
  onReply,
  showActions,
}: Props) {
  const handleReply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    onReply(message);
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await deleteMsg(chatId, message.id);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <div
      className={`
        flex shrink-0 items-center gap-1
        transition-opacity duration-200

        ${
          showActions
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }

        md:pointer-events-auto
        md:opacity-0
        md:group-hover/message:opacity-100
      `}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={handleReply}
        aria-label="Reply to message"
        className="
          touch-manipulation
          flex items-center justify-center
          rounded-full p-2
          text-slate-300
          transition-all duration-200
          hover:bg-orange-50
          hover:text-orange-400
          active:scale-90

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
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleDelete}
          aria-label="Delete message"
          className="
            touch-manipulation
            flex items-center justify-center
            rounded-full p-2
            text-slate-300
            transition-all duration-200
            hover:bg-rose-50
            hover:text-rose-300
            active:scale-90

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
