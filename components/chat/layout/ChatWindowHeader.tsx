import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types/messages";

export default function ChatWindowHeader({
  selectedUser,
  messages,
}: {
  selectedUser: { photoURL: string; name: string };
  messages: Message[];
}) {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-white/20 dark:border-zinc-800 px-6 py-4 bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl">
        <Avatar className="h-10 w-10 border border-white/60 dark:border-zinc-700 shadow-xs">
          <AvatarImage
            src={selectedUser?.photoURL || ""}
            alt={selectedUser?.name || "User"}
          />
          <AvatarFallback className="bg-linear-to-tr from-amber-400 to-orange-500 font-bold text-white">
            {selectedUser?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-zinc-100">
            {selectedUser?.name || "Unknown User"}
          </h2>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </p>
        </div>
      </div>
    </>
  );
}
