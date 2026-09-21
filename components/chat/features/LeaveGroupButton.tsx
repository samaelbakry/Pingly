import { getUserChats } from "@/services/chats";
import { leaveGroupChat } from "@/services/groupChatActions";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type LeaveGroupButtonProps = {
  userId: string;
  chatId: string;
};
export default function LeaveGroupButton({
  userId,
  chatId,
}: LeaveGroupButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLeave = async () => {
    try {
      setLoading(true);
      setError(null);
      await leaveGroupChat(userId, chatId);
      await getUserChats(userId);
      toast.success("Leaving and deleting the group chat..");
    } catch (err) {
      console.error("Failed to leave group:", err);
      setError(err instanceof Error ? err.message : "Failed to leave group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleLeave}
        disabled={loading}
        title="Leave Group"
        className="p-2 text-slate-500 rounded-md cursor-pointer transition-colors hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50"
      >
        <LogOut className={`size-4 ${loading ? "animate-pulse" : ""}`} />
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
