import { getUserChats } from "@/services/chats";
import { leaveGroupChat } from "@/services/groupChatActions";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type LeaveGroupButtonProps = {
  userId: string;
  chatId: string;
  handleLeaveChat: () => void;
};

export default function LeaveGroupButton({
  userId,
  chatId,
  handleLeaveChat,
}: LeaveGroupButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLeave = async () => {
    try {
      setLoading(true);
      setError(null);

      await leaveGroupChat(userId, chatId);
      await getUserChats(userId);

      toast.success("Leaving and deleting the group chat...");
      handleLeaveChat();
    } catch (err) {
      console.error("Failed to leave group:", err);

      setError(
        err instanceof Error ? err.message : "Failed to leave group"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleLeave}
        disabled={loading}
        title="Leave Group"
        className="
          flex w-full items-center gap-2
          rounded-lg px-2 py-2
          text-sm font-medium
          text-red-600
          transition-colors
          hover:bg-red-50
          dark:text-red-400
          dark:hover:bg-red-950/30
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <LogOut
          className={`size-4 shrink-0 ${
            loading ? "animate-pulse" : ""
          }`}
        />

        <span>Leave Group</span>
      </button>

      {error && (
        <p className="mt-1 px-2 text-xs text-red-500">
          {error}
        </p>
      )}
    </>
  );
}