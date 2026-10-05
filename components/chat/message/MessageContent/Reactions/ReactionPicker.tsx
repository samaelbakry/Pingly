"use client";

import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { addReaction, removeReaction } from "@/services/reactions";
import { Message, ReactionEmoji } from "@/types/messages";

type Props = {
  message: Message;
  chatId: string;
};

const reactionEmojis: ReactionEmoji[] = [
  "❤️",
  "😂",
  "👍",
  "😮",
  "😢",
  "🔥",
];

export default function ReactionPicker({
  message,
  chatId,
}: Props) {
  const { user: currentUser } = useAuth();

  const [reactionOpen, setReactionOpen] = useState(false);

  const reactions = message.reactions ?? {};

  const handleReaction = async (emoji: ReactionEmoji) => {
    if (!currentUser?.uid) return;

    const currentReaction = reactions[currentUser.uid];

    try {
      if (currentReaction === emoji) {
        await removeReaction(
          chatId,
          message.id,
          currentUser.uid,
        );
      } else {
        await addReaction(
          chatId,
          message.id,
          currentUser.uid,
          emoji,
        );
      }

      setReactionOpen(false);
    } catch (error) {
      console.error("Failed to update reaction:", error);
    }
  };

  return (
    <div
      onPointerDown={(e) => {
        if (e.pointerType === "touch") {
          setReactionOpen((prev) => !prev);
        }
      }}
      className={`
        absolute -top-12 left-1/2 z-35
        -translate-x-1/2
        items-center gap-1
        rounded-full
        bg-white/95
        px-2.5 py-1.5
        ring-1 ring-slate-200/70
        shadow-[0_6px_24px_rgba(148,163,184,0.18)]
        backdrop-blur-xl
        dark:bg-slate-800/95
        dark:ring-slate-700/60
        dark:shadow-[0_6px_24px_rgba(0,0,0,0.25)]
        transition-all duration-300 ease-out

        ${
          reactionOpen
            ? "flex scale-100 opacity-100"
            : "hidden sm:group-hover/message:flex sm:group-hover/message:scale-100 sm:group-hover/message:opacity-100"
        }
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {reactionEmojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => handleReaction(emoji)}
          className="
            flex size-7
            items-center justify-center
            rounded-full
            text-lg
            transition-all duration-200 ease-out
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