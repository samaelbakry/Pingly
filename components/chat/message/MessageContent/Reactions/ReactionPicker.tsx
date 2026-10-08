"use client";

import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { addReaction, removeReaction } from "@/services/reactions";
import { Message, ReactionEmoji } from "@/types/messages";

type Props = {
  message: Message;
  chatId: string;
  showActions?: boolean;
};

const reactionEmojis: ReactionEmoji[] = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

export default function ReactionPicker({
  message,
  chatId,
  showActions = false,
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

  const handlePickerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handlePickerClick}
      className={`
        absolute
        -top-12
        left-1/2
        z-35
        -translate-x-1/2

        flex
        items-center
        gap-1

        rounded-full
        bg-white/95
        px-2.5
        py-1.5

        ring-1
        ring-slate-200/70

        shadow-[0_6px_24px_rgba(148,163,184,0.18)]
        backdrop-blur-xl

        dark:bg-slate-800/95
        dark:ring-slate-700/60
        dark:shadow-[0_6px_24px_rgba(0,0,0,0.25)]

        transition-all
        duration-200
        ease-out

        ${
          showActions
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }

        sm:pointer-events-none
        sm:opacity-0
        sm:scale-95

        sm:group-hover/message:pointer-events-auto
        sm:group-hover/message:opacity-100
        sm:group-hover/message:scale-100
      `}
    >
      {reactionEmojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleReaction(emoji);
          }}
          className="
            flex
            size-7
            items-center
            justify-center
            rounded-full
            text-lg

            transition-all
            duration-200
            ease-out

            hover:scale-110
            hover:bg-orange-50

            active:scale-95

            dark:hover:bg-orange-400/15
          "
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
