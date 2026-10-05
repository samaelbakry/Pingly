"use client";

import { deleteMsg } from "@/services/messages";
import { Message, ReactionEmoji } from "@/types/messages";
import { Reply, Trash2 } from "lucide-react";

import ImageMessage from "./ImageMessage";
import { useAuth } from "@/context/AuthContext";
import { addReaction, removeReaction } from "@/services/reactions";
import { useState } from "react";

type Props = {
  message: Message;
  chatId: string;
  isMine: boolean;
  onReply: (message: Message) => void;
  isGroupChat: boolean;
};

const reactionEmojis: ReactionEmoji[] = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

export default function MessageContent({
  message,
  chatId,
  isMine,
  onReply,
  isGroupChat,
}: Props) {
  const isImage = message.type === "image";
  const reactions = message.reactions ?? {};

  const { user: currentUser } = useAuth();

  const [reactionOpen, setReactionOpen] = useState(false);

  const handleReaction = async (emoji: ReactionEmoji) => {
    if (!currentUser?.uid) return;

    const currentReaction = reactions[currentUser.uid];

    try {
      if (currentReaction === emoji) {
        await removeReaction(chatId, message.id, currentUser.uid);
      } else {
        await addReaction(chatId, message.id, currentUser.uid, emoji);
      }

      setReactionOpen(false);
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
    <div
      className="relative group/message"
      onPointerDown={(e) => {
        if (e.pointerType === "touch") {
          setReactionOpen((prev) => !prev);
        }
      }}
    >
      <div
        onPointerDown={(e) => e.stopPropagation()}
        className={`
          absolute -top-12 left-1/2 z-35
          -translate-x-1/2
          flex items-center gap-1
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

      <div
        className={`flex items-end gap-2 ${
          isMine ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`
            flex min-w-0 max-w-[85%] flex-col
            sm:max-w-[70%]
            ${isMine ? "items-end" : "items-start"}
          `}
        >
          {isGroupChat && message.replyTo && (
            <div
              className={`
                mb-1.5 flex max-w-full min-w-0 items-center gap-2.5
                overflow-hidden
                rounded-xl
                border
                px-3 py-2
                shadow-sm
                backdrop-blur-sm
                ${
                  isMine
                    ? `
                      border-orange-200/70
                      bg-orange-50/85
                      dark:border-orange-400/20
                      dark:bg-orange-400/10
                    `
                    : `
                      border-sky-200/70
                      bg-sky-50/85
                      dark:border-sky-400/20
                      dark:bg-sky-400/10
                    `
                }
              `}
            >
              <div
                className={`
                  self-stretch w-1 shrink-0 rounded-full
                  ${isMine ? "bg-orange-400" : "bg-sky-400"}
                `}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Reply
                    className={`
                      h-3 w-3 shrink-0
                      ${isMine ? "text-orange-500" : "text-sky-500"}
                    `}
                  />

                  <p
                    className={`
                      truncate text-[10px] font-bold
                      ${
                        isMine
                          ? "text-orange-600 dark:text-orange-300"
                          : "text-sky-600 dark:text-sky-300"
                      }
                    `}
                  >
                    {message.replyTo.senderName || "Unknown User"}
                  </p>
                </div>

                <div className="mt-1">
                  {message.replyTo.type === "image" ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs opacity-70">📷</span>

                      <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Photo
                      </p>
                    </div>
                  ) : (
                    <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {message.replyTo.text || "Message"}
                    </p>
                  )}
                </div>
              </div>

              {message.replyTo.type === "image" && message.replyTo.imageUrl && (
                <img
                  src={message.replyTo.imageUrl}
                  alt="Replied image"
                  className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-black/5 dark:ring-white/10"
                />
              )}
            </div>
          )}

          <div
            className={`flex items-center gap-2 ${
              isMine ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onReply(message)}
                aria-label="Reply to message"
                className="
                  rounded-full p-2
                  text-slate-300
                  opacity-0
                  transition-all duration-200
                  hover:bg-orange-50
                  hover:text-orange-400
                  group-hover/message:opacity-100
                  dark:text-slate-600
                  dark:hover:bg-orange-400/10
                  dark:hover:text-orange-300
                "
              >
                <Reply className="h-3.5 w-3.5" />
              </button>

              {isMine && (
                <button
                  type="button"
                  onClick={() => deleteMsg(chatId, message.id)}
                  aria-label="Delete message"
                  className="
                    rounded-full p-2
                    text-slate-300
                    opacity-0
                    transition-all duration-200
                    hover:bg-rose-50
                    hover:text-rose-300
                    group-hover/message:opacity-100
                    dark:text-slate-600
                    dark:hover:bg-rose-400/10
                    dark:hover:text-rose-300
                  "
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div
              className={`
                relative overflow-hidden
                transition-all duration-200

                ${
                  isImage
                    ? "rounded-[1.25rem] p-1"
                    : "rounded-[1.25rem] px-4 py-2.5"
                }

                ${
                  isMine
                    ? `
                      rounded-br-md
                      bg-linear-to-br
                      from-orange-200
                      to-indigo-200
                      text-indigo-950
                      shadow-[0_2px_14px_rgba(167,139,250,0.18)]
                      dark:from-orange-400/30
                      dark:to-indigo-400/30
                      dark:text-orange-50
                      dark:shadow-none
                    `
                    : `
                      rounded-bl-md
                      bg-slate-100/90
                      text-slate-700
                      ring-1 ring-slate-200/50
                      dark:bg-slate-800/80
                      dark:text-slate-200
                      dark:ring-slate-700/50
                    `
                }
              `}
            >
              {!isGroupChat && message.replyTo && (
                <div
                  className={`
                    mb-2 flex min-w-0 items-center gap-2.5
                    overflow-hidden
                    rounded-xl
                    border-l-3
                    px-3 py-2
                    ${
                      isMine
                        ? `
                          border-l-orange-400/70
                          bg-white/45
                          dark:border-l-orange-300/60
                          dark:bg-white/10
                        `
                        : `
                          border-l-sky-300
                          bg-white/70
                          dark:border-l-sky-400/60
                          dark:bg-slate-900/40
                        `
                    }
                  `}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={`
                        truncate text-[11px] font-semibold
                        ${
                          isMine
                            ? "text-orange-700 dark:text-orange-200"
                            : "text-sky-600 dark:text-sky-300"
                        }
                      `}
                    >
                      {message.replyTo.senderName || "Unknown User"}
                    </p>

                    <div className="mt-0.5">
                      {message.replyTo.type === "image" ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs opacity-70">📷</span>

                          <p
                            className={`
                              truncate text-[11px]
                              ${
                                isMine
                                  ? "text-indigo-900/70 dark:text-orange-100/70"
                                  : "text-slate-500 dark:text-slate-400"
                              }
                            `}
                          >
                            Photo
                          </p>
                        </div>
                      ) : (
                        <p
                          className={`
                            truncate text-[11px]
                            ${
                              isMine
                                ? "text-indigo-900/70 dark:text-orange-100/70"
                                : "text-slate-500 dark:text-slate-400"
                            }
                          `}
                        >
                          {message.replyTo.text || "Message"}
                        </p>
                      )}
                    </div>
                  </div>

                  {message.replyTo.type === "image" &&
                    message.replyTo.imageUrl && (
                      <img
                        src={message.replyTo.imageUrl}
                        alt="Replied image"
                        className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-white/60 dark:ring-white/10"
                      />
                    )}
                </div>
              )}

              {isImage ? (
                <ImageMessage message={message} />
              ) : (
                <p className="max-w-full truncate whitespace-nowrap text-[13px] leading-[1.6] sm:text-sm">
                  {message.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {Object.keys(groupedReactions).length > 0 && (
        <div
          className={`
            mt-1.5 flex flex-wrap gap-1.5
            ${isMine ? "justify-end" : "justify-start"}
          `}
        >
          {Object.entries(groupedReactions).map(([emoji, count]) => {
            const myReaction = reactions[currentUser?.uid ?? ""] === emoji;

            return (
              <button
                key={emoji}
                type="button"
                onClick={() => handleReaction(emoji as ReactionEmoji)}
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
                <span className="text-xs leading-none">{emoji}</span>

                <span className="text-[10px] font-semibold opacity-70">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
