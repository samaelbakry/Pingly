"use client";

import { Message } from "@/types/messages";
import ReactionPicker from "./Reactions/ReactionPicker";
import ReplyMessagePreview from "./ReplyPreview/ReplyMessagePreview";
import MessageActions from "./MessageActions/MessageActions";
import ImageMessage from "../ImageMessage";
import ReactionList from "./Reactions/ReactionList";
import MessageMeta from "../MessageMeta";

type Props = {
  message: Message;
  chatId: string;
  isMine: boolean;
  onReply: (message: Message) => void;
  isGroupChat: boolean;
};

export default function MessageContent({
  message,
  chatId,
  isMine,
  onReply,
  isGroupChat,
}: Props) {
  const isImage = message.type === "image";

  return (
    <div className="relative group/message">
      <ReactionPicker message={message} chatId={chatId} />

      <div
        className={`flex w-full items-end gap-2 ${
          isMine ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`
            flex min-w-0 max-w-full flex-col
            ${isMine ? "items-end" : "items-start"}
          `}
        >
          {isGroupChat && message.replyTo && (
            <ReplyMessagePreview
              replyTo={message.replyTo}
              isMine={isMine}
              variant="outside"
            />
          )}

          <div
            className={`flex min-w-0 items-center gap-2 ${
              isMine ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div
              className={`flex min-w-0 items-center gap-2 ${
                isMine ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <MessageActions
                message={message}
                chatId={chatId}
                isMine={isMine}
                onReply={onReply}
              />

              <div
                className={`
                  relative flex w-fit min-w-25
                  max-w-[min(75vw,520px)]
                  flex-col
                  transition-all duration-200

                  ${
                    isImage
                      ? "rounded-[1.25rem] p-1"
                      : "rounded-[1.25rem] px-4 py-2.5"
                  }

                  ${
                    isMine
                      ? `
                        rounded-br-md
                        bg-linear-to-br
                        from-orange-200
                        to-indigo-200
                        text-indigo-950
                        shadow-[0_2px_14px_rgba(167,139,250,0.18)]
                        dark:from-orange-400/30
                        dark:to-indigo-400/30
                        dark:text-orange-50
                        dark:shadow-none
                      `
                      : `
                        rounded-bl-md
                        bg-slate-100/90
                        text-slate-700
                        ring-1 ring-slate-200/50
                        dark:bg-slate-800/80
                        dark:text-slate-200
                        dark:ring-slate-700/50
                      `
                  }
                `}
              >
                {!isGroupChat && message.replyTo && (
                  <ReplyMessagePreview
                    replyTo={message.replyTo}
                    isMine={isMine}
                    variant="inside"
                  />
                )}

                {isImage ? (
                  <div className="h-auto max-w-full overflow-hidden rounded-[1rem]">
                    <ImageMessage message={message} />
                  </div>
                ) : (
                  <p
                    className="
                      w-fit
                      max-w-full
                      whitespace-normal
                     wrap-break-word
                      text-[13px]
                      leading-[1.6]
                      sm:text-sm
                    "
                  >
                    {message.text}
                  </p>
                )}

                <MessageMeta message={message} isMine={isMine} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReactionList message={message} chatId={chatId} isMine={isMine} />
    </div>
  );
}
