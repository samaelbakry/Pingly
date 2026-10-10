import { BlockStatus as blockStatusType} from '@/services/block'

export default function BlockStatusUI({blockStatus}:{blockStatus:blockStatusType}) {
  return (
    <>
      <div className="shrink-0 border-t border-zinc-200/70 bg-white/50 px-5 py-4 text-center backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/40">
          {blockStatus === "loading" && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Checking contact status...
            </p>
          )}

          {blockStatus === "blocked-by-me" && (
            <>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                You blocked this contact
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Unblock them from the chat header to send messages again.
              </p>
            </>
          )}

          {blockStatus === "blocked-me" && (
            <>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                You can&apos;t message this contact
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                This contact has blocked you.
              </p>
            </>
          )}

          {blockStatus === "both" && (
            <>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                You have blocked each other
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Unblock this contact from the chat header to change your block
                status.
              </p>
            </>
          )}
        </div>
    </>
  )
}
