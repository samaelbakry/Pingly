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
        className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 transition-colors cursor-pointer"
      >
        <LogOut className={`w-4 h-4 ${loading ? "animate-pulse" : ""}`} />
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
