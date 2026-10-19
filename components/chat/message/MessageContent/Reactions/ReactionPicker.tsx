"use client";

import { useAuth } from "@/context/AuthContext";
import { addReaction, removeReaction } from "@/services/reactions";
import { Message, ReactionEmoji } from "@/types/messages";
import { type MouseEvent } from "react";

type Props = {
  message: Message;
  chatId: string;
  showActions?: boolean;
  isMine: boolean;
};

const reactionEmojis: ReactionEmoji[] = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

export default function ReactionPicker({
  message,
  chatId,
  showActions = false,
  isMine = false,
}: Props) {
  const { user: currentUser } = useAuth();

  const reactions = message.reactions ?? {};

  const handleReaction = async (emoji: ReactionEmoji) => {
    if (!currentUser?.uid) return;

    const currentReaction = reactions[currentUser.uid];

    try {
      if (currentReaction === emoji) {
        await removeReaction(chatId, message.id, currentUser.uid);
      } else {
        await addReaction(chatId, message.id, currentUser.uid, emoji);
      }
    } catch (error) {
      console.error("Failed to update reaction:", error);
    }
  };

  const handlePickerClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      onClick={handlePickerClick}
      className={`
    absolute z-[60]
    ${isMine ? "right-1 -top-11" : "left-1 -top-11"}

    flex items-center gap-1 whitespace-nowrap
    rounded-full border border-zinc-200/80
    bg-white/95 px-2 py-1.5
    shadow-[0_6px_24px_rgba(148,163,184,0.2)]
    backdrop-blur-xl
    dark:border-zinc-700 dark:bg-zinc-800/95
    dark:shadow-[0_6px_24px_rgba(0,0,0,0.3)]
    transition-[opacity,transform] duration-150 ease-out
    ${
      showActions
        ? "pointer-events-auto scale-100 opacity-100"
        : "pointer-events-none scale-95 opacity-0"
    }
  `}
    >
      {reactionEmojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          aria-label={`React with ${emoji}`}
          onClick={(event) => {
            event.stopPropagation();
            void handleReaction(emoji);
          }}
          className="
            flex size-8 shrink-0 items-center justify-center
            rounded-full text-lg
            transition-transform duration-150
            hover:scale-125 hover:bg-orange-50
            active:scale-95
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-orange-500/50
            dark:hover:bg-orange-400/15
          "
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
