import { MessageCircle } from "lucide-react";

export default function EmptyChatState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-5">
        <div
          className="
            absolute inset-0
            rounded-3xl
            bg-orange-400/20
            blur-xl
          "
        />

        <div
          className="
            relative
            flex h-16 w-16
            items-center justify-center
            rounded-3xl
            border border-orange-200/60
            bg-white
            shadow-[0_12px_40px_rgba(249,115,22,0.12)]
            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >
          <MessageCircle className="h-6 w-6 text-orange-500" />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        No messages yet
      </h3>

      <p className="mt-1.5 max-w-60 text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
        Start the conversation and send your first message.
      </p>
    </div>
  );
}