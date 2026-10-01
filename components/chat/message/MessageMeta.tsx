import { CheckCheck } from "lucide-react";
import { Message } from "@/types/messages";

type Props = {
  message: Message;
  isMine: boolean;
};

export default function MessageMeta({
  message,
  isMine,
}: Props) {
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
      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-600">
        {time}
      </span>

      {isMine && (
        <CheckCheck className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
      )}
    </div>
  );
}