import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { archiveChat, clearChat } from "@/services/chatActions";
import { ChatItem } from "@/types/chatType";
import { Message } from "@/types/messages";
import { UserProfile } from "@/types/userProfile";
import { Archive, Trash2 } from "lucide-react";

export default function ChatWindowHeader({
  selectedUser,
  selectedGroup,
  isGroupChat,
  messages,
  chatId,
  currentUserId,
}: {
 selectedUser: UserProfile | null;
  selectedGroup: ChatItem | null;
  isGroupChat: boolean;
  messages: Message[];
  chatId: string;
  currentUserId: string;
}) {
  const displayName = isGroupChat
  ? selectedGroup?.name || "Unnamed Group"
  : selectedUser?.name || "Unknown User";

const displayPhoto = isGroupChat
  ? selectedGroup?.photoURL || ""
  : selectedUser?.photoURL || "";
  return (
    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 px-6 py-3.5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-slate-200 dark:border-zinc-700 shadow-xs">
         <AvatarImage
  src={displayPhoto}
  alt={displayName}
/>

<AvatarFallback
  className={
    isGroupChat
      ? "bg-linear-to-tr from-violet-500 to-purple-600 font-bold text-white"
      : "bg-linear-to-tr from-amber-400 to-orange-500 font-bold text-white"
  }
>
  {displayName.charAt(0).toUpperCase()}
</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-zinc-100">
            {displayName}
          </h2>
         <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
  {isGroupChat
    ? `${Object.keys(selectedGroup?.participants || {}).length} members`
    : `${messages.length} ${
        messages.length === 1 ? "message" : "messages"
      }`}
</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {messages.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="size-4 mr-1.5" />
                  Clear chat
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear conversation?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove all
                  messages from this chat history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => clearChat(chatId)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, clear chat
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Button
          onClick={() => archiveChat(currentUserId, chatId)}
          variant="ghost"
          size="sm"
          aria-label="Archive chat"
          className="text-slate-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
        >
          <Archive className="size-4" />
        </Button>
      </div>
    </div>
  );
}
