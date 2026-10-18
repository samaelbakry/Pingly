type Props = {
  count: number;
};

export default function UnreadMessagesDivider({ count }: Props) {
  if (count <= 0) return null;

  return (
    <div className="flex items-center gap-3 py-4">
      <div className="h-px flex-1 bg-orange-300/70 dark:bg-orange-400/30" />

      <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-400/10 dark:text-orange-300">
        {count} Unread {count === 1 ? "Message" : "Messages"}
      </span>

      <div className="h-px flex-1 bg-orange-300/70 dark:bg-orange-400/30" />
    </div>
  );
}
