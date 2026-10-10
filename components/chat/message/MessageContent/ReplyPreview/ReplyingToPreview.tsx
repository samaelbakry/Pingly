"use client";

import { Reply, X } from "lucide-react";
import { ReplyTo } from "@/types/messages";

type Props = {
  replyTo: ReplyTo;
  onCancel: () => void;
};

export default function ReplyingToPreview({
  replyTo,
  onCancel,
}: Props) {
  const isImage = replyTo.type === "image";

  return (
    <div
      className="
        mb-3 flex items-center gap-2.5
        overflow-hidden
        rounded-xl
        border border-orange-200/70
        bg-orange-50/80
        px-3 py-2.5
        shadow-sm
        backdrop-blur-sm
        dark:border-orange-400/20
        dark:bg-orange-400/10
      "
    >
      <div
        className="
          self-stretch w-1 shrink-0
          rounded-full
          bg-orange-400
          dark:bg-orange-400
        "
      />

      <Reply className="h-4 w-4 shrink-0 text-orange-500 dark:text-orange-400" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-orange-600
              dark:text-orange-300
            "
          >
            Replying to
          </p>

          {replyTo.senderName && (
            <>
              <span className="text-[10px] text-orange-300 dark:text-orange-500">
                •
              </span>

              <p
                className="
                  min-w-0
                  truncate
                  text-[10px]
                  font-semibold
                  text-orange-600
                  dark:text-orange-300
                "
              >
                {replyTo.senderName}
              </p>
            </>
          )}
        </div>

        <div className="mt-0.5">
          {isImage ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs opacity-70">📷</span>

              <p
                className="
                  truncate
                  text-[11px]
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Photo
              </p>
            </div>
          ) : (
            <p
              className="
                  min-w-0
                      max-w-full
                      whitespace-normal
                      wrap-break-word
                      text-[13px]
                      leading-[1.6]
                      sm:text-sm
                text-slate-600
                dark:text-slate-300
              "
            >
              {replyTo.text || "Message"}
            </p>
          )}
        </div>
      </div>

      {isImage && replyTo.imageUrl && (
        <img
          src={replyTo.imageUrl}
          alt="Replied image"
          className="
            h-10 w-10
            shrink-0
            rounded-lg
            object-cover
            ring-1
            ring-orange-200/70
            dark:ring-orange-400/20
          "
        />
      )}

      <button
        type="button"
        onClick={onCancel}
        aria-label="Cancel reply"
        className="
          flex h-7 w-7
          shrink-0
          items-center justify-center
          rounded-full
          text-slate-400
          transition-all duration-200
          hover:bg-white
          hover:text-slate-700
          hover:scale-105
          active:scale-95
          dark:text-slate-500
          dark:hover:bg-slate-800
          dark:hover:text-slate-200
        "
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
