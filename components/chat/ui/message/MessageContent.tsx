"use client";

import { deleteMsg } from "@/services/messages";
import { Message } from "@/types/messages";
import { Trash2 } from "lucide-react";

import ImageMessage from "./ImageMessage";

type Props = {
  message: Message;
  chatId: string;
  isMine: boolean;
};

export default function MessageContent({ message, chatId, isMine }: Props) {
  const isImage = message.type === "image";

  return (
    <div className="flex items-center gap-2">
      {isMine && (
        <button
          type="button"
          onClick={() => deleteMsg(chatId, message.id)}
          aria-label="Delete message"
          className="
            rounded-full p-1.5
            text-zinc-300
            opacity-0
            transition-all duration-200
            hover:bg-red-50 hover:text-red-500
            group-hover:opacity-100
            dark:text-zinc-600
            dark:hover:bg-red-950/30
            dark:hover:text-red-400
          "
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}

      <div
        className={`
          relative overflow-hidden
          transition-all duration-200
          ${isImage ? "rounded-[20px] p-1" : "rounded-[20px] px-4 py-3"}

          ${
            isMine
              ? `
                rounded-br-md
                bg-linear-to-br from-orange-500 via-orange-500 to-amber-500
                text-white
                shadow-[0_6px_20px_rgba(249,115,22,0.16)]
              `
              : `
                rounded-bl-md
                border border-zinc-200/70
                bg-white
                text-zinc-800
                shadow-[0_4px_18px_rgba(0,0,0,0.04)]
                dark:border-zinc-800
                dark:bg-zinc-900
                dark:text-zinc-100
              `
          }
        `}
      >
        {isImage ? (
          <ImageMessage message={message} />
        ) : (
          <p className="whitespace-pre-wrap wrap-break-words text-[13px] leading-[1.55] sm:text-sm">
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
