import { CheckCheck } from "lucide-react";
import { Message } from "@/types/messages";

type Props = {
  message: Message;
  isMine: boolean;
};

export default function MessageMeta({ message, isMine }: Props) {
  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  return (
    <div
      className={`
        mt-1 flex items-center gap-1.5 px-2
        ${isMine ? "flex-row-reverse" : "flex-row"}
      `}
    >
      {isMine && (
        <CheckCheck
          className={`
      h-3.5 w-3.5
      ${
        message?.seen
          ? "text-blue-500 dark:text-blue-400"
          : "text-zinc-400 dark:text-zinc-500"
      }
    `}
        />
      )}

      <span
        className="
          text-[10px] font-medium
           text-slate-500 dark:text-slate-100
        "
      >
        {time}
      </span>
    </div>
  );
}
