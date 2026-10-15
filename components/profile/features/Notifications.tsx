"use client";

import { Bell, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserChats } from "@/services/chats";
import { listenToAllUserMessages } from "@/services/notifications";
import { getUserById } from "@/services/users";

import type { UserProfile } from "@/types/userProfile";
import NotificationRow from "./NotificationRow";

export type NotificationItem = {
  id: string;
  user: UserProfile;
  message: string;
};


export default function Notifications() {
  const { user: currentUser } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    let cancelled = false;
    let unsubscribeMessages: (() => void) | undefined;
    let notificationCounter = 0;

    const setupListener = async () => {
      try {
        const chats = await getUserChats(currentUser.uid);

        if (cancelled) return;

        const chatIds = chats.map((chat) => chat.chatId);

        if (chatIds.length === 0) return;

        const unsubscribe = listenToAllUserMessages(
          chatIds,
          currentUser.uid,
          async (message) => {
            if (!message?.senderId) return;
            if (message.senderId === currentUser.uid) return;

            try {
              const sender = await getUserById(message.senderId);

              if (cancelled || !sender) return;

              const notificationMessage =
                message.text?.trim() ||
                (message.type === "image"
                  ? "Sent you a photo"
                  : "Sent you a message");

              const notification: NotificationItem = {
                id: `${message.senderId}-${++notificationCounter}`,
                user: sender,
                message: notificationMessage,
              };

              setNotifications((previous) =>
                [notification, ...previous].slice(0, 5),
              );
            } catch (error) {
              console.error("Failed to load notification sender:", error);
            }
          },
        );

        if (cancelled) {
          unsubscribe();
        } else {
          unsubscribeMessages = unsubscribe;
        }
      } catch (error) {
        console.error("Failed to setup notifications:", error);
      }
    };

    void setupListener();

    return () => {
      cancelled = true;
      unsubscribeMessages?.();
    };
  }, [currentUser?.uid]);

  const dismissNotification = (id: string) => {
    setNotifications((previous) => previous.filter((item) => item.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
   
<section className="relative chat-scroll h-full min-h-0 overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
  <div className="relative z-10 mx-auto w-full max-w-6xl">
    <header className="mb-8 flex items-center justify-between gap-4 border-b border-zinc-200/70 pb-6 dark:border-zinc-800">
      <div className="flex min-w-0 items-stretch gap-4">
        <div className="w-1 shrink-0 rounded-full bg-linear-to-b from-orange-500 to-amber-300" />

        <div className="min-w-0 py-1">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">
            Messages & updates
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Notifications
          </h1>

          <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Your recent messages and updates.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 animate-in fade-in-50 slide-in-from-top-3 duration-300">
        {notifications.length > 0 && (
          <button
            type="button"
            onClick={clearNotifications}
            aria-label="Clear all notifications"
            title="Clear all notifications"
            className="flex h-10 items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/70 px-3 text-xs font-semibold text-zinc-500 transition-colors hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-500 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400 dark:hover:border-red-500/20"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear all</span>
          </button>
        )}

        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/70 text-zinc-600 shadow-sm transition-all duration-300 hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-orange-500 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300">
          <Bell className="h-5 w-5" strokeWidth={1.7} />

          {notifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-orange-500 px-1 text-[9px] font-bold text-white dark:border-zinc-950">
              {notifications.length}
            </span>
          )}
        </div>
      </div>
    </header>

    {notifications.length > 0 ? (
      <div className="space-y-1 rounded-2xl border border-zinc-200/60 bg-white/40 p-2 dark:border-zinc-800/80 dark:bg-zinc-950/20 animate-in fade-in-50 slide-in-from-top-3 duration-300">
        {notifications.map((item) => (
          <NotificationRow
            key={item.id}
            item={item}
            onDismiss={dismissNotification}
          />
        ))}
      </div>
    ) : (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white/30 px-5 py-12 text-center dark:border-zinc-800 dark:bg-zinc-950/20 animate-in fade-in-50 slide-in-from-top-3 duration-300">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/10 bg-orange-500/10 text-orange-500">
          <Bell className="h-6 w-6" />
        </div>

        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
          You&apos;re all caught up
        </h3>

        <p className="mt-2 max-w-xs text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          New message notifications will appear here when someone sends you a message.
        </p>
      </div>
    )}
  </div>
</section>

  );
}
