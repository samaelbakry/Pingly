"use client";

import { CheckCheck, MessageSquare, Send, Smile, Sparkles } from "lucide-react";
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

type ChatPropsType = {
  selectedUserId: string | null;
  chatId: string | null;
};

export default function ChatArea({selectedUserId,chatId }: ChatPropsType) {
  const { user: currentUser } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //handle any chat updates
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
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-8 text-center shadow-xl shadow-orange-500/5 backdrop-blur-2xl">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-linear-to-br from-amber-300/20 to-orange-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-linear-to-tr from-rose-400/20 to-orange-300/20 blur-3xl" />

        <div className="relative z-10 flex max-w-xs flex-col items-center">
          <div className="relative mb-2">
            <Logo />
            <Sparkles className="absolute -top-1 -right-3 h-4 w-4 animate-pulse text-amber-500" />
          </div>

          <h3 className="mt-3 bg-linear-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-xl font-black tracking-tight text-transparent">
            Select a conversation
          </h3>

          <p className="mt-2 text-xs font-medium leading-relaxed text-slate-400">
            Choose a contact from the sidebar list to view messages and start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-xl shadow-orange-500/5 backdrop-blur-2xl">
      <div className="shrink-0 flex items-center justify-between border-b border-orange-100/60 bg-white/40 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-none">
              Conversation
            </h2>
            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Smile className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-slate-700">No messages yet</p>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
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
                  className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium shadow-xs transition-all ${
                    isMine
                      ? "rounded-br-xs bg-linear-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-orange-500/20"
                      : "rounded-bl-xs bg-white text-slate-800 border border-orange-100/80 shadow-orange-500/5"
                  }`}
                >
                  <p className="leading-relaxed wrap-break-words">{message.text}</p>
                </div>

                <div className="mt-1 flex items-center gap-1 px-1">
                  <span className="text-[10px] font-medium text-slate-400">
                    {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Just now"}
                  </span>
                  {isMine && (
                    <CheckCheck className="h-3 w-3 text-orange-500 stroke-[2.5]" />
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
        className="shrink-0 border-t border-orange-100/60 p-4 bg-white/40 backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="h-11 flex-1 rounded-2xl border-slate-200/80 bg-white/80 px-4 text-xs sm:text-sm placeholder:text-slate-400 focus-visible:border-orange-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-orange-500/10 transition-all"
          />

          <Button
            type="submit"
            disabled={sending || !messageText.trim()}
            className="h-11 w-11 shrink-0 rounded-2xl bg-linear-to-r from-amber-500 via-orange-500 to-red-500 p-0 text-white shadow-lg shadow-orange-500/20 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}