"use client";

import { useAuth } from "@/context/AuthContext";
import { addReaction, removeReaction } from "@/services/reactions";
import { Message, ReactionEmoji } from "@/types/messages";

type Props = {
  message: Message;
  chatId: string;
  isMine: boolean;
};

export default function ReactionList({
  message,
  chatId,
  isMine,
}: Props) {
  const { user: currentUser } = useAuth();

  const reactions = message.reactions ?? {};

  const groupedReactions = Object.values(reactions).reduce(
    (acc, emoji) => {
      acc[emoji] = (acc[emoji] ?? 0) + 1;

      return acc;
    },
    {} as Record<ReactionEmoji, number>,
  );

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
    } catch (error) {
      console.error("Failed to update reaction:", error);
    }
  };

  if (Object.keys(groupedReactions).length === 0) {
    return null;
  }

  return (
    <div
      className={`
        mt-1.5 flex flex-wrap gap-1.5
        ${isMine ? "justify-end" : "justify-start"}
      `}
    >
      {Object.entries(groupedReactions).map(
        ([emoji, count]) => {
          const myReaction =
            reactions[currentUser?.uid ?? ""] === emoji;

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
                px-2.5 py-0.5
                text-xs font-medium
                ring-1
                transition-all duration-200
                hover:scale-105
                active:scale-95

                ${
                  myReaction
                    ? `
                      bg-orange-100
                      text-orange-600
                      ring-orange-200
                      dark:bg-orange-400/20
                      dark:text-orange-200
                      dark:ring-orange-400/30
                    `
                    : `
                      bg-white/80
                      text-slate-500
                      ring-slate-200/70
                      dark:bg-slate-800/70
                      dark:text-slate-400
                      dark:ring-slate-700/60
                    `
                }
              `}
            >
              <span className="text-xs leading-none">
                {emoji}
              </span>

              <span className="text-[10px] font-semibold opacity-70">
                {count}
              </span>
            </button>
          );
        },
      )}
    </div>
  );
}