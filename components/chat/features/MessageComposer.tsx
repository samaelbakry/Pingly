"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/services/messages";
import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function MessageComposer({chatId, currentUserId }: {chatId: string; currentUserId: string }) {
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");

  // send message
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = messageText.trim();

    if (!text || !chatId || !currentUserId || sending) return;

    try {
      setSending(true);
      setMessageText("");

      await sendMessage(chatId, currentUserId, text);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSendMessage}
        className="shrink-0 border-t border-white/20 dark:border-zinc-800 p-4 bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2">
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
    </>
  );
}
