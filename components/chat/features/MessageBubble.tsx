"use client"
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/types/messages';
import { CheckCheck, Smile } from 'lucide-react';

export default function MessageBubble({messages}:{messages:Message[]}) {
     const { user: currentUser } = useAuth();

  return (
    <>
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
            const isImage = message.type === "image"; 
            return (
              <div
                key={message.id}
                className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-[65%] rounded-2xl overflow-hidden px-4 py-2.5 text-xs sm:text-sm font-normal shadow-xs transition-all ${
                    isMine
                      ? "rounded-br-xs bg-linear-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-orange-500/15 dark:shadow-none"
                      : "rounded-bl-xs bg-white/60 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-white/60 dark:border-zinc-700 backdrop-blur-md shadow-sm"
                  } ${isImage ? "p-1.5" : ""}`} 
                >
                  {isImage ? (
                    <img
                      src={message.imageUrl} 
                      alt={message.text || "Shared image"}
                      className="max-h-60 w-auto rounded-xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <p className="leading-relaxed wrap-break-words">{message.text}</p>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-1 px-1">
                  <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                    {message.createdAt
                      ? new Date(message.createdAt).toLocaleTimeString([], {
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
    </>
  )
}
