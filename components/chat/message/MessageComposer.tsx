"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/services/messages";
import { setTyping } from "@/services/typing";
import { uploadImage } from "@/services/uploads";
import { ReplyTo } from "@/types/messages";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Image, Loader2, Send, SmilePlus } from "lucide-react";
import React, {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
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

  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file || !chatId || !currentUserId) return;

    try {
      setSending(true);

      const imageUrl = await uploadImage(file);

      await sendMessage(chatId, currentUserId, {
        type: "image",
        imageUrl,
        replyTo: replyingTo ?? undefined
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

  return (
    <form
      onSubmit={handleSendMessage}
      className="
        relative shrink-0
        border-t border-white/20
        bg-white/20
        px-2.5 py-2.5
        backdrop-blur-xl
        sm:px-4 sm:py-4
        dark:border-zinc-800
        dark:bg-zinc-900/20
      "
    >
      {replyingTo && (
        <div className="mb-2">
          <ReplyingToPreview
            onCancel={onCancelReply}
            replyTo={replyingTo}
          />
        </div>
      )}

      {showEmojiPicker && (
        <div
          className="
            absolute
            bottom-full
            left-2
            z-50
            mb-2
            overflow-hidden
            rounded-2xl
            border border-slate-200
            shadow-2xl
            animate-in fade-in zoom-in-95 duration-150

            sm:left-4
            sm:mb-3

            dark:border-zinc-800
          "
        >
          <EmojiPicker
            onEmojiClick={handleEmojiPicker}
            width="min(320px, calc(100vw - 24px))"
            height={380}
          />
        </div>
      )}

      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <div className="relative shrink-0">
          <input
            id="chat-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          <label
            htmlFor="chat-image"
            aria-label="Upload image"
            className="
              flex
              h-9 w-9
              cursor-pointer
              items-center
              justify-center
              rounded-full
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-700

              sm:h-10 sm:w-10

              dark:text-zinc-400
              dark:hover:bg-zinc-800
              dark:hover:text-zinc-200
            "
          >
            {sending ? (
              <Loader2
                aria-label="Sending image"
                className="size-4 animate-spin sm:size-5"
              />
            ) : (
              <Image
                aria-label="Upload image"
                className="size-4 sm:size-5"
              />
            )}
          </label>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          aria-label="Open emoji picker"
          className="
            h-9 w-9
            shrink-0
            rounded-full
            text-slate-500
            hover:bg-white/40
            hover:text-slate-700

            sm:h-10 sm:w-10

            dark:text-zinc-400
            dark:hover:bg-zinc-800/60
            dark:hover:text-zinc-200
          "
        >
          <SmilePlus className="size-5 sm:size-6" />
        </Button>

        <Input
          value={messageText}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="
            h-10
            min-w-0
            flex-1
            rounded-full
            border-white/40
            bg-white/40
            px-3
            text-xs
            text-slate-900
            shadow-inner
            backdrop-blur-md
            transition-all

            placeholder:text-slate-400

            focus-visible:border-orange-400
            focus-visible:bg-white/60
            focus-visible:ring-4
            focus-visible:ring-orange-500/10

            sm:h-11
            sm:px-4
            sm:text-sm

            dark:border-zinc-800
            dark:bg-zinc-800/60
            dark:text-zinc-100
            dark:placeholder:text-zinc-500
            dark:focus-visible:border-orange-500
            dark:focus-visible:bg-zinc-800
          "
        />

        <Button
          type="submit"
          disabled={sending || !messageText.trim()}
          aria-label="Send message"
          className="
            h-10 w-10
            shrink-0
            rounded-full
            bg-linear-to-r
            from-amber-500
            via-orange-500
            to-red-500
            p-0
            text-white
            shadow-lg
            shadow-orange-500/20
            transition-all

            hover:opacity-95
            active:scale-95
            disabled:opacity-50

            sm:h-11 sm:w-11

            dark:shadow-none
          "
        >
          <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </form>
  );
}