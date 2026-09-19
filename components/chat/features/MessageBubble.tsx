"use client";

import { useAuth } from "@/context/AuthContext";
import { deleteMsg } from "@/services/messages";
import { Message } from "@/types/messages";
import { CheckCheck, Image as ImageIcon, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

export default function MessageBubble({
  messages,
  chatId,
}: {
  messages: Message[];
  chatId: string;
}) {
  const { user: currentUser } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-orange-200/70 bg-white/70 shadow-[0_10px_40px_rgba(249,115,22,0.12)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          Start the conversation
        </h3>

        <p className="mt-1.5 max-w-55 text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
          Send a message and make this chat come alive.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => {
        const isMine = message.senderId === currentUser?.uid;
        const isImage = message.type === "image";

        return (
          <div
            key={message.id}
            className={`group flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[82%] flex-col sm:max-w-[68%] ${
                isMine ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-2">
                {isMine && (
                  <button
                    type="button"
                    onClick={() => deleteMsg(chatId, message.id)}
                    aria-label="Delete message"
                    className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}

                <div
                  className={`relative overflow-hidden ${
                    isImage ? "rounded-2xl p-1.5" : "rounded-2xl px-4 py-3"
                  } ${
                    isMine
                      ? "rounded-br-md bg-linear-to-br from-orange-500 via-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/10"
                      : "rounded-bl-md border border-zinc-200/80 bg-white/85 text-zinc-800 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100"
                  }`}
                >
                  {isImage ? (
                    <div className="relative overflow-hidden rounded-xl">
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-200/80 dark:bg-zinc-800/80 backdrop-blur-sm animate-pulse rounded-xl z-10 transition-opacity duration-500">
                          <ImageIcon className="h-4 w-4 text-slate-400 dark:text-zinc-500 animate-bounce" />
                          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                            Loading image...
                          </span>
                        </div>
                      )}

                      <img
                        src={message.imageUrl}
                        alt={message.text || "Shared image"}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        className={`max-h-80 w-auto min-w-30 rounded-xl object-cover transition-all duration-500 group-hover:scale-[1.02] ${
                          imageLoaded
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95"
                        }`}
                      />

                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                        <ImageIcon className="h-3 w-3" />
                        Photo
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap wrap-break-words text-[13px] leading-5 sm:text-sm">
                      {message.text}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`mt-1.5 flex items-center gap-1.5 px-1 ${
                  isMine ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                  {message.createdAt
                    ? new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Just now"}
                </span>

                {isMine && (
                  <CheckCheck className="h-3.5 w-3.5 stroke-[2.5] text-orange-500 dark:text-orange-400" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
