"use client";

import { Reply } from "lucide-react";
import { Message } from "@/types/messages";
import Image from "next/image";

type ReplyTo = NonNullable<Message["replyTo"]>;

type Props = {
  replyTo: ReplyTo;
  isMine: boolean;
  variant: "outside" | "inside";
};

export default function ReplyMessagePreview({
  replyTo,
  isMine,
  variant,
}: Props) {
  const isImage = replyTo.type === "image";

  const senderColor = isMine
    ? "text-orange-600 dark:text-orange-300"
    : "text-sky-600 dark:text-sky-300";

  const messageColor = isMine
    ? "text-indigo-900/70 dark:text-orange-100/70"
    : "text-slate-500 dark:text-slate-400";

  const imagePreview = (
    <div className="flex min-w-0 items-center gap-1.5">
      <span className="shrink-0 text-xs opacity-70">📷</span>

      <p className={`min-w-0 truncate text-[11px] ${messageColor}`}>Photo</p>
    </div>
  );

  const textPreview = (
    <p className={`min-w-0  text-[11px] ${messageColor}`}>
      {replyTo.text || "Message"}
    </p>
  );

  if (variant === "outside") {
    return (
      <div
        className={`
          mb-1.5 flex w-fit max-w-full min-w-0 items-center gap-2.5
          overflow-hidden rounded-xl border
          px-3 py-2 shadow-sm backdrop-blur-sm

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
            h-full min-h-8 w-0.5 shrink-0 rounded-full
            ${isMine ? "bg-orange-400" : "bg-sky-400"}
          `}
        />

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <Reply
              className={`
                h-3 w-3 shrink-0
                ${isMine ? "text-orange-500" : "text-sky-500"}
              `}
            />

            <p
              className={`
                min-w-0 truncate text-[10px] font-bold
                ${senderColor}
              `}
            >
              {replyTo.senderName || "Unknown User"}
            </p>
          </div>

          <div className="mt-1 min-w-0">
            {isImage ? imagePreview : textPreview}
          </div>
        </div>

        {isImage && replyTo.imageUrl && (
          <img
            src={replyTo.imageUrl}
            alt="Replied image"
            className="
              h-9 w-9 shrink-0 rounded-lg
              object-cover
              ring-1 ring-black/5
              dark:ring-white/10
            "
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`
        mb-2 flex w-full min-w-0 items-center gap-2.5
        overflow-hidden rounded-xl border-l-3
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
            min-w-0  text-[11px] font-semibold
            ${senderColor}
          `}
        >
          {replyTo.senderName || "Unknown User"}
        </p>

        <div className="mt-0.5 min-w-0">
          {isImage ? imagePreview : textPreview}
        </div>
      </div>

      {isImage && replyTo.imageUrl && (
        <img
          src={replyTo.imageUrl}
          alt="Replied image"
          className="
            h-9 w-9 shrink-0 rounded-lg
            object-cover
            ring-1 ring-white/60
            dark:ring-white/10
          "
        />
      )}
    </div>
  );
}
