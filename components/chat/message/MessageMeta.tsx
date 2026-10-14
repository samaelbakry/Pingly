"use client";
import { CheckCheck } from "lucide-react";
import { Message } from "@/types/messages";
import { useReadReceipts } from "@/hooks/privacy/readReceipts/useReadReceipts";
import { useAuth } from "@/context/AuthContext";

type Props = {
  message: Message;
  isMine: boolean;
};

export default function MessageMeta({ message, isMine }: Props) {
  const { user: currentUser } = useAuth();

  const { readReceiptsEnabled } = useReadReceipts(currentUser?.uid);
  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  const isSeen = readReceiptsEnabled && message.seen === true;
  return (
    <div
      className={`
        flex
        mt-1 px-2
        items-center gap-1.5
        ${isMine ? "flex-row-reverse" : "flex-row"}
      `}
    >
      {isMine && (
        <CheckCheck
          className={`
            h-3.5 w-3.5
            transition-colors
            duration-500 ease-in-out
            ${
              isSeen
                ? "text-blue-500 dark:text-blue-400"
                : "text-zinc-400 dark:text-zinc-500"
            }
          `}
        />
      )}
      <span
        className="
          text-[10px] font-medium text-slate-500
          dark:text-slate-100
        "
      >
        {time}
      </span>
    </div>
  );
}
