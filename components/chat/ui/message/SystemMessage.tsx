import { Message } from "@/types/messages";
import { UserProfile } from "@/types/userProfile";

type Props = {
  message: Message;
  chatUsers: Record<string, UserProfile>;
};

export default function SystemMessage({
  message,
  chatUsers,
}: Props) {
  if (message.action !== "left") {
    return null;
  }

  const user = chatUsers[message.userId ?? ""];

  return (
    <div className="flex justify-center py-2">
      <div
        className="
          rounded-full
          border border-zinc-200/70
          bg-zinc-50
          px-3.5 py-1.5
          text-[10px]
          font-medium
          text-zinc-400
          shadow-sm
          dark:border-zinc-800
          dark:bg-zinc-900
          dark:text-zinc-500
        "
      >
        <span className="text-zinc-500 dark:text-zinc-400">
          {user?.name ?? "Someone"}
        </span>{" "}
        left the group
      </div>
    </div>
  );
}