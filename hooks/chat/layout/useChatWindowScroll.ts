"use client";

import { useEffect, useRef } from "react";

export function useChatWindowScroll( chatId: string | null, messagesCount: number ) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatId || messagesCount === 0) return;

    const frameId = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [chatId, messagesCount]);

  return messagesEndRef;
}