"use client";

import { ChatItem } from "@/types/chatType";
import { Message } from "@/types/messages";
import { useState } from "react";

import ArchiveButton from "../../actions/ArchiveButton";
import ClearChatButton from "../../actions/ClearChatButton";
import AddMembersDialog from "../../dialogs/AddMembersDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { leaveGroupChat } from "@/services/groupChatActions";
import { EllipsisVerticalIcon, LogOut, Trash2, UserPlus } from "lucide-react";

import { toast } from "sonner";
import BlockUserButton from "../../actions/BlockUserButton";
import { UserProfile } from "@/types/userProfile";

export default function ChatWindowHeaderDropdown({
  messages,
  chatId,
  currentUserId,
  isGroupCreator,
  selectedGroup,
  selectedUser,
  isGroupChat,
  handleLeaveChat,
}: {
  messages: Message[];
  chatId: string;
  currentUserId: string;
  isGroupCreator: boolean;
  selectedGroup: ChatItem | null;
  selectedUser: UserProfile | null;
  isGroupChat: boolean;
  handleLeaveChat: () => void;
}) {
  const [clearOpen, setClearOpen] = useState(false);
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const openClearDialog = () => {
    setTimeout(() => {
      setClearOpen(true);
    }, 0);
  };

  const openAddMembersDialog = () => {
    setTimeout(() => {
      setAddMembersOpen(true);
    }, 0);
  };

  const handleLeaveGroup = async () => {
    try {
      setLeaving(true);

      await leaveGroupChat(currentUserId, chatId);

      toast.success("You left the group");

      handleLeaveChat();
    } catch (error) {
      console.error("Failed to leave group:", error);
      toast.error("Failed to leave group");
    } finally {
      setLeaving(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full
                text-slate-500
                transition-colors
                hover:bg-slate-100
                hover:text-slate-900
                focus:outline-none
                dark:text-zinc-400
                dark:hover:bg-zinc-800
                dark:hover:text-zinc-100
              "
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
              <span className="sr-only">Open chat options</span>
            </button>
          }
        />

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="
            w-60 rounded-xl
            border border-slate-200/80
            bg-white p-1.5
            shadow-lg
            dark:border-zinc-800
            dark:bg-zinc-950
          "
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel
              className="
                px-3 py-2
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-400
                dark:text-zinc-500
              "
            >
              Chat Settings
            </DropdownMenuLabel>

            {messages.length > 0 && (
              <DropdownMenuItem
                onClick={openClearDialog}
                className="
                  cursor-pointer
                  gap-2
                  rounded-lg
                  text-slate-700
                  focus:bg-red-50
                  focus:text-red-600
                  dark:text-zinc-200
                  dark:focus:bg-red-950/30
                  dark:focus:text-red-400
                "
              >
                <Trash2 className="size-4" />
                <span>Clear Chat</span>
              </DropdownMenuItem>
            )}

            {isGroupCreator && isGroupChat && selectedGroup && (
              <DropdownMenuItem
                onClick={openAddMembersDialog}
                className="
                    cursor-pointer
                    gap-2
                    rounded-lg
                    text-slate-700
                    focus:bg-slate-100
                    dark:text-zinc-200
                    dark:focus:bg-zinc-800
                  "
              >
                <UserPlus className="size-4" />
                <span>Add Members</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel
              className="
                px-3 py-2
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-400
                dark:text-zinc-500
              "
            >
              Chat Actions
            </DropdownMenuLabel>

            <DropdownMenuItem className="p-0 focus:bg-transparent">
              <ArchiveButton chatId={chatId} currentUserId={currentUserId} />
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 focus:bg-transparent">
              {selectedUser?.uid && currentUserId && (
                <BlockUserButton
                  currentUserId={currentUserId}
                  targetUserId={selectedUser.uid}
                />
              )}
            </DropdownMenuItem>

            {isGroupChat && (
              <DropdownMenuItem
                disabled={leaving}
                onClick={handleLeaveGroup}
                className="
                  cursor-pointer
                  gap-2
                  rounded-lg
                  text-red-600
                  focus:bg-red-50
                  focus:text-red-600
                  dark:text-red-400
                  dark:focus:bg-red-950/30
                "
              >
                <LogOut
                  className={`size-4 ${leaving ? "animate-pulse" : ""}`}
                />

                <span>{leaving ? "Leaving..." : "Leave Group"}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ClearChatButton
        chatId={chatId}
        open={clearOpen}
        onOpenChange={setClearOpen}
      />

      {selectedGroup && (
        <AddMembersDialog
          chatId={chatId}
          existingMemberIds={Object.keys(selectedGroup.participants || {})}
          open={addMembersOpen}
          onOpenChange={setAddMembersOpen}
        />
      )}
    </>
  );
}
