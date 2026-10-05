"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/services/messages";
import { setTyping } from "@/services/typing";
import { uploadImage } from "@/services/uploads";
import { ReplyTo } from "@/types/messages";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Image, Loader2, Reply, Send, SmilePlus, X } from "lucide-react";
import React, { useEffect, useRef, useState, type FormEvent } from "react";
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
      });

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

  return (
    <form
      onSubmit={handleSendMessage}
      className="relative shrink-0 border-t border-white/20 dark:border-zinc-800 p-4 bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl"
    >
      {replyingTo && (
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-orange-200/70 bg-orange-50/70 px-3 py-2.5 dark:border-orange-500/20 dark:bg-orange-500/5">
          <div className="h-9 w-1 rounded-full bg-orange-500" />

          <Reply className="h-4 w-4 shrink-0 text-orange-500" />

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
              Replying to
            </p>

            <p className="truncate text-xs font-medium text-zinc-600 dark:text-zinc-300">
              {replyingTo.type === "image"
                ? "📷 Photo"
                : replyingTo.text || "Message"}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancelReply}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Cancel reply"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-4 mb-3 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-150">
          <EmojiPicker
            onEmojiClick={handleEmojiPicker}
            width={320}
            height={400}
            // theme={theme}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            id="chat-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          <label
            htmlFor="chat-image"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-slate-100"
          >
            {sending ? (
              <Loader2
                aria-label="Sending image"
                className="size-5 animate-spin"
              />
            ) : (
              <Image aria-label="Upload image" className="size-5" />
            )}
          </label>
        </div>
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="shrink-0 rounded-full text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-white/40 dark:hover:bg-zinc-800/60"
          >
            <SmilePlus className="size-6" />
          </Button>
        </div>

        <Input
          value={messageText}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="h-11 flex-1 rounded-full border-white/40 dark:border-zinc-800 bg-white/40 dark:bg-zinc-800/60 px-4 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 backdrop-blur-md focus-visible:border-orange-400 dark:focus-visible:border-orange-500 focus-visible:bg-white/60 dark:focus-visible:bg-zinc-800 focus-visible:ring-4 focus-visible:ring-orange-500/10 transition-all shadow-inner"
        />

        <Button
          type="submit"
          disabled={sending || !messageText.trim()}
          className="h-11 w-11 shrink-0 rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-red-500 p-0 text-white shadow-lg shadow-orange-500/20 dark:shadow-none hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
