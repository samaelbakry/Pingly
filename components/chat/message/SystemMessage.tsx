import { Message } from "@/types/messages";
import { UserProfile } from "@/types/userProfile";

type Props = {
  message: Message;
  chatUsers: Record<string, UserProfile>;
};

export default function SystemMessage({ message, chatUsers}: Props) {
  if (message.type !== "system") {
    return null;
  }

  const user = chatUsers[message.userId ?? ""];

  if (message.action === "left") {
    return (
      <div
        key={message.id}
        className="my-3 flex justify-center"
      >
        <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {user?.name ?? "Someone"} left the group
        </span>
      </div>
    );
  }

  if (message.action === "admin_changed") {
    return (
      <div
        key={message.id}
        className="my-3 flex justify-center"
      >
        <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-500 dark:bg-violet-950/30 dark:text-violet-400">
          {user?.name ?? "Someone"} is now the group admin
        </span>
      </div>
    );
  }

  return null;
}