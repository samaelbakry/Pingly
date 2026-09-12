"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCheck, Send, Smile, Sparkles } from "lucide-react";
import { SubmitEvent, useEffect, useRef, useState } from "react";

import Logo from "../ui/Logo";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
  listenToMessages,
  sendMessage,
} from "@/services/messages";
import { Message } from "@/types/messages";

import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/userProfile";


type ChatPropsType = {
  selectedUserId: string | null;
  selectedUser: UserProfile | null;
  chatId: string | null;
};

export default function ChatArea({selectedUserId, selectedUser ,chatId }: ChatPropsType) {
  const { user: currentUser } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //handle any changes
 useEffect(() => {
  if (!chatId) return;

  const unsubscribe = listenToMessages(chatId, (fetchedMessages) => {
    setMessages(fetchedMessages);
  });

  return () => {
    unsubscribe();
  };
}, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

 
  // send message
  const handleSendMessage = async (e: SubmitEvent) => {
    e.preventDefault();

    const text = messageText.trim();

    if (!text || !chatId || !currentUser?.uid || sending) return;

    try {
      setSending(true);
      setMessageText("");

      await sendMessage( chatId , currentUser.uid , text);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  if (!selectedUserId || !chatId) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-8 text-center shadow-xl shadow-orange-500/5 dark:shadow-none backdrop-blur-2xl">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-linear-to-br from-amber-300/20 to-orange-400/20 dark:from-amber-600/10 dark:to-orange-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-linear-to-tr from-rose-400/20 to-orange-300/20 dark:from-rose-600/10 dark:to-orange-600/10 blur-3xl" />

        <div className="relative z-10 flex max-w-xs flex-col items-center">
          <div className="relative mb-2">
            <Logo />
            <Sparkles className="absolute -top-1 -right-3 h-4 w-4 animate-pulse text-amber-500 dark:text-amber-400" />
          </div>

          <h3 className="mt-3 bg-linear-to-r from-orange-600 via-red-500 to-rose-600 dark:from-orange-400 dark:via-red-400 dark:to-rose-400 bg-clip-text text-xl font-black tracking-tight text-transparent">
            Select a conversation
          </h3>

          <p className="mt-2 text-xs font-medium leading-relaxed text-slate-400 dark:text-zinc-500">
            Choose a contact from the sidebar list to view messages and start chatting
          </p>
        </div>
      </div>
    );
  }


   return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-white/40 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/40 shadow-[0_8px_32px_0_rgba(249,115,22,0.06)] dark:shadow-none backdrop-blur-3xl">
      <div className="flex items-center gap-3 border-b border-white/20 dark:border-zinc-800 px-6 py-4 bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl">
        <Avatar className="h-10 w-10 border border-white/60 dark:border-zinc-700 shadow-xs">
          <AvatarImage
            src={selectedUser?.photoURL || ""}
            alt={selectedUser?.name || "User"}
          />
          <AvatarFallback className="bg-linear-to-tr from-amber-400 to-orange-500 font-bold text-white">
            {selectedUser?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-zinc-100">
            {selectedUser?.name || "Unknown User"}
          </h2>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
            {messages.length}{" "}
            {messages.length === 1 ? "message" : "messages"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 mb-3 backdrop-blur-md">
              <Smile className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200">No messages yet</p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 mt-0.5">
              Say hello to break the ice 👋
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === currentUser?.uid;

            return (
              <div
                key={message.id}
                className={`flex flex-col ${
                  isMine ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-normal shadow-xs transition-all ${
                    isMine
                      ? "rounded-br-xs bg-linear-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-orange-500/15 dark:shadow-none"
                      : "rounded-bl-xs bg-white/60 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-white/60 dark:border-zinc-700 backdrop-blur-md shadow-sm"
                  }`}
                >
                  <p className="leading-relaxed wrap-break-words">{message.text}</p>
                </div>

                <div className="mt-1 flex items-center gap-1 px-1">
                  <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                    {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "Just now"}
                  </span>
                  {isMine && (
                    <CheckCheck className="h-3 w-3 text-orange-500 dark:text-orange-400 stroke-[2.5]" />
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

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
     
    </div>
  );
}