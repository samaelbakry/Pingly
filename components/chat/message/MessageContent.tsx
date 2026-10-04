"use client";

import { deleteMsg } from "@/services/messages";
import { Message, ReactionEmoji } from "@/types/messages";
import { Trash2 } from "lucide-react";

import ImageMessage from "./ImageMessage";
import { useAuth } from "@/context/AuthContext";
import { addReaction, removeReaction } from "@/services/reactions";

type Props = {
  message: Message;
  chatId: string;
  isMine: boolean;
};

const reactionEmojis: ReactionEmoji[] = [
  "❤️",
  "😂",
  "👍",
  "😮",
  "😢",
  "🔥",
];

export default function MessageContent({ message, chatId, isMine }: Props) {
  const isImage = message.type === "image";
  const reactions = message.reactions ?? {};
  const { user: currentUser } = useAuth();

  const handleReaction = async (emoji: ReactionEmoji) => {
    const currentReaction = reactions[currentUser?.uid || ""];

    try {
      if (currentReaction === emoji) {
        await removeReaction(chatId, message.id, currentUser?.uid || "");
        return;
      }
      await addReaction(chatId, message.id, currentUser?.uid || "", emoji);
    } catch (error) {
      console.error("Failed to update reaction:", error);
    }
  };

  const groupedReactions = Object.values(reactions).reduce(
    (acc, emoji) => {
      acc[emoji] = (acc[emoji] ?? 0) + 1;
      return acc;
    },
    {} as Record<ReactionEmoji, number>,
  );

  return (
    <div className="relative group/message">
      <div
        className="
          absolute -top-12 left-1/2 z-30
          hidden -translate-x-1/2
          items-center gap-1.5
          rounded-full
          border border-zinc-200/60
          bg-white/80
          px-3 py-1.5
          shadow-lg shadow-black/5
          backdrop-blur-2xl
          group-hover/message:flex
          animate-in fade-in zoom-in-95 duration-200
          dark:border-zinc-700/60
          dark:bg-zinc-950/80
        "
      >
        {reactionEmojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleReaction(emoji)}
            className="
              flex size-8
              items-center justify-center
              rounded-full
              text-xl
              transition-all duration-200 ease-out
              hover:scale-125
              hover:bg-zinc-200/60
              active:scale-95
              dark:hover:bg-zinc-800/60
            "
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {isMine && (
          <button
            type="button"
            onClick={() => deleteMsg(chatId, message.id)}
            aria-label="Delete message"
            className="
              rounded-full p-1.5
              text-zinc-300
              opacity-0
              transition-all duration-200
              hover:bg-red-50
              hover:text-red-500
              group-hover/message:opacity-100
              dark:text-zinc-600
              dark:hover:bg-red-950/30
              dark:hover:text-red-400
            "
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}

        <div
          className={`
            relative overflow-hidden
            transition-all duration-200

            ${
              isImage
                ? "rounded-[20px] p-1"
                : "rounded-[20px] px-4 py-3"
            }

            ${
              isMine
                ? `
                  rounded-br-md
                  bg-linear-to-br
                  from-orange-500
                  via-orange-500
                  to-amber-500
                  text-white
                  shadow-[0_6px_20px_rgba(249,115,22,0.16)]
                `
                : `
                  rounded-bl-md
                  border border-zinc-200/70
                  bg-white
                  text-zinc-800
                  shadow-[0_4px_18px_rgba(0,0,0,0.04)]
                  dark:border-zinc-800
                  dark:bg-zinc-900
                  dark:text-zinc-100
                `
            }
          `}
        >
          {isImage ? (
            <ImageMessage message={message} />
          ) : (
            <p className="whitespace-pre-wrap wrap-break-words text-[13px] leading-[1.55] sm:text-sm">
              {message.text}
            </p>
          )}
        </div>
      </div>

      {Object.keys(groupedReactions).length > 0 && (
        <div
          className={`
            mt-1 flex flex-wrap gap-1
            ${isMine ? "justify-end" : "justify-start"}
          `}
        >
          {Object.entries(groupedReactions).map(
            ([emoji, count]) => {
              const myReaction = reactions[currentUser?.uid ?? ""] === emoji;

              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() =>
                    handleReaction(emoji as ReactionEmoji)
                  }
                  className={`
                    flex items-center gap-1
                    rounded-full
                    border
                    px-2.5 py-0.5
                    text-xs font-medium
                    shadow-xs
                    transition-all duration-200
                    hover:scale-105
                    active:scale-95

                    ${
                      myReaction
                        ? `
                          border-orange-400/50
                          bg-orange-50/90
                          text-orange-900
                          dark:border-orange-500/40
                          dark:bg-orange-500/15
                          dark:text-orange-200
                        `
                        : `
                          border-zinc-200/80
                          bg-white/90
                          text-zinc-700
                          backdrop-blur-xs
                          dark:border-zinc-800
                          dark:bg-zinc-900/90
                          dark:text-zinc-300
                        `
                    }
                  `}
                >
                  <span className="text-sm leading-none">{emoji}</span>
                  <span className="text-[11px] font-semibold opacity-80">{count}</span>
                </button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}