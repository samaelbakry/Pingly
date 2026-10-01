"use client";

import { Message } from "@/types/messages";
import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  message: Message;
};

export default function ImageMessage({ message }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[16px] bg-zinc-100 dark:bg-zinc-800">
      {!loaded && (
        <div className="absolute inset-0 flex min-h-32 min-w-40 items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
      )}

      <img
        src={message.imageUrl}
        alt={message.text || "Shared image"}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`
          max-h-[360px]
          max-w-full
          min-w-[120px]
          rounded-[16px]
          object-cover
          transition-all
          duration-500
          ${
            loaded
              ? "scale-100 opacity-100"
              : "scale-[0.97] opacity-0"
          }
        `}
      />

      {loaded && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
          <ImageIcon className="h-3 w-3" />
          Photo
        </div>
      )}
    </div>
  );
}