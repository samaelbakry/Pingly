"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/services/messages";
import { uploadImagetoChat } from "@/services/uploads";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Image, Loader2, Send, SmilePlus } from "lucide-react";
import React, { useState, type FormEvent } from "react";

export default function MessageComposer({chatId,currentUserId }: {chatId: string; currentUserId: string }) {

  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // const {theme} = useTheme()
  const [sending, setSending] = useState(false);

  // send message
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
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

const handleImageSelect = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file || !chatId || !currentUserId) return;

  try {
    setSending(true);

    const imageUrl = await uploadImagetoChat(file);

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

  return (
    <form
      onSubmit={handleSendMessage}
      className="relative shrink-0 border-t border-white/20 dark:border-zinc-800 p-4 bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl"
    >
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
              <Loader2 aria-label="Sending image" className="size-5 animate-spin" />
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
          onChange={(e) => setMessageText(e.target.value)}
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
