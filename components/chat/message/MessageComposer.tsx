"use client";

import { Button } from "@/components/ui/button";
import { sendMessage } from "@/services/messages";
import { setTyping } from "@/services/typing";
import { uploadImage } from "@/services/uploads";
import { ReplyTo } from "@/types/messages";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle
} from "emoji-picker-react";
import { Loader2, Plus, Send } from "lucide-react";
import React, { useEffect, useRef, useState, type FormEvent } from "react";
import { BiSticker } from "react-icons/bi";
import ReplyingToPreview from "./MessageContent/ReplyPreview/ReplyingToPreview";

export default function MessageComposer({
  chatId,
  currentUserId,
  replyingTo,
  onCancelReply,
}: {
  chatId: string;
  currentUserId: string;
  replyingTo: ReplyTo | null;
  onCancelReply: () => void;
}) {
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sending, setSending] = useState(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = (value: string) => {
    setMessageText(value);

    if (!chatId || !currentUserId) return;

    setTyping(chatId, currentUserId, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(chatId, currentUserId, false);
    }, 1500);
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = messageText.trim();

    if (!text || !chatId || !currentUserId || sending) return;

    try {
      setSending(true);
      setMessageText("");

      await sendMessage(chatId, currentUserId, {
        type: "text",
        text,
        replyTo: replyingTo ?? undefined,
      });

      onCancelReply?.();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      await setTyping(chatId, currentUserId, false);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !chatId || !currentUserId) return;

    try {
      setSending(true);

      const imageUrl = await uploadImage(file);

      await sendMessage(chatId, currentUserId, {
        type: "image",
        imageUrl,
        replyTo: replyingTo ?? undefined,
      });
      onCancelReply?.();

      console.log("Image message sent:", imageUrl);
    } catch (error) {
      console.error("Failed to send image:", error);
    } finally {
      setSending(false);
      e.target.value = "";
    }
  };

  const handleEmojiPicker = (emojiData: EmojiClickData) => {
    setMessageText((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (chatId && currentUserId) {
        setTyping(chatId, currentUserId, false);
      }
    };
  }, [chatId, currentUserId]);

  const hasText = messageText.trim().length > 0;
  return (
 <form
    onSubmit={handleSendMessage}
    className="
      relative shrink-0
      border-t border-white/30
      bg-linear-to-t from-white/50 to-white/10
      px-2.5 py-2.5
      backdrop-blur-2xl
      sm:px-4 sm:py-4
      dark:border-zinc-800/60
      dark:from-zinc-900/60 dark:to-zinc-900/10
    "
  >
    {replyingTo && (
      <div className="mb-2">
        <ReplyingToPreview onCancel={onCancelReply} replyTo={replyingTo} />
      </div>
    )}

    {showEmojiPicker && (
      <div
        className="
          absolute bottom-full left-2 z-50 mb-3 overflow-hidden rounded-3xl
          border border-slate-200/80 bg-white/90 p-1 shadow-2xl backdrop-blur-xl
          animate-in fade-in zoom-in-95 duration-200 chat-scroll
          sm:left-4 sm:mb-4
          dark:border-zinc-800/80 dark:bg-zinc-950/90
        "
      >
        <EmojiPicker
          onEmojiClick={handleEmojiPicker}
          autoFocusSearch={false}
          emojiStyle={EmojiStyle.APPLE}
          width="min(340px, calc(100vw - 32px))"
          height={380}
          searchPlaceHolder="Search for emoji"
          previewConfig={{ showPreview: false }}
          lazyLoadEmojis={true}
        />
      </div>
    )}

    <div className="flex min-w-0 items-end gap-2">
      <div
        className="
          flex shrink-0 items-center gap-0.5
          rounded-full p-1
          border border-white/60 bg-white/60
          shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_16px_-6px_rgba(0,0,0,0.15)]
          backdrop-blur-xl
          dark:border-zinc-700/60 dark:bg-zinc-800/70
          dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_16px_-6px_rgba(0,0,0,0.6)]
        "
      >
        <input
          id="chat-file"
          type="file"
          className="hidden"
          onChange={handleImageSelect} 
        />

        <label
          htmlFor="chat-file"
          aria-label="Attach file"
          className="
            flex h-8 w-8 cursor-pointer items-center justify-center rounded-full
            bg-linear-to-br from-amber-500/15 to-red-500/15
            text-orange-600
            transition-all duration-200
            hover:rotate-90 hover:from-amber-500 hover:to-red-500 hover:text-white
            active:scale-90
            sm:h-9 sm:w-9
            dark:text-orange-400
          "
        >
          {sending ? (
            <Loader2 className="size-4 animate-spin sm:size-5" />
          ) : (
            <Plus className="size-4 sm:size-5 dark:text-white/80" strokeWidth={2.5} />
          )}
        </label>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          aria-label="Open emoji picker"
          className="
            h-8 w-8 shrink-0 rounded-full
            text-slate-500 transition-all duration-200
            hover:scale-110 hover:bg-orange-500/10 hover:text-orange-500
            active:scale-90
            sm:h-9 sm:w-9
            dark:text-zinc-400 dark:hover:bg-orange-500/15 dark:hover:text-orange-400
          "
        >
          <BiSticker className="size-5 sm:size-6" />
        </Button>
      </div>

      <div
       className="
    group min-w-0 flex-1
    rounded-[1.75rem] p-[1.5px]
    bg-white/60
    shadow-[0_4px_20px_-6px_rgba(0,0,0,0.15)]
    transition-all duration-500
    focus-within:bg-linear-to-r focus-within:from-amber-200/85 focus-within:via-orange-200/85 focus-within:to-rose-300/85
    focus-within:shadow-[0_0_20px_2px_rgba(251,191,36,0.2)]
    dark:bg-zinc-700/60
    dark:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.6)]
    dark:focus-within:shadow-[0_0_22px_3px_rgba(251,191,36,0.12)]
  "
      >
        <div
          className="
            flex items-end gap-1
            rounded-[calc(1.75rem-1.5px)]
            bg-white/85 py-1 pl-4 pr-1
            shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]
            backdrop-blur-xl
            transition-colors duration-300
            sm:pl-5
            dark:bg-zinc-900/90
            dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
          "
        >
          <textarea
            rows={1}
            value={messageText}
            onChange={(e) => handleTyping(e.target.value)}
            readOnly={sending}
            placeholder="Write something nice..."
            aria-label="Message"
            enterKeyHint="send"
            className="
              chat-scroll
              max-h-30 min-h-9 min-w-0 flex-1 resize-none
              border-0 bg-transparent py-2 leading-5
              text-base font-medium tracking-tight text-slate-800
              caret-orange-500 outline-none
              placeholder:font-normal placeholder:text-slate-400
              sm:min-h-10 sm:py-2.5 sm:text-sm
              dark:text-zinc-100 dark:placeholder:text-zinc-500
            "
          />

          <Button
            type="submit"
            disabled={sending || !hasText}
            aria-label="Send message"
            className={`
              relative h-9 w-9 shrink-0 overflow-hidden rounded-full p-0 text-white
              transition-all duration-300 ease-out
              sm:h-10 sm:w-10
              ${
                hasText
                  ? "scale-100 bg-linear-to-br from-amber-400 via-orange-500 to-red-500 shadow-lg shadow-orange-500/40 hover:scale-105 hover:shadow-orange-500/60 active:scale-90"
                  : "scale-90 bg-slate-200 text-slate-400 shadow-none dark:bg-zinc-800 dark:text-zinc-600"
              }
            `}
          >
            {hasText && (
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/40 to-transparent" />
            )}
            {sending ? (
              <Loader2 className="relative size-4 animate-spin" />
            ) : (
              <Send
                className={`relative h-3.5 w-3.5 transition-transform duration-300 sm:h-4 sm:w-4 ${
                  hasText ? "-rotate-12 group-focus-within:translate-x-px" : ""
                }`}
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  </form>
  );
}
