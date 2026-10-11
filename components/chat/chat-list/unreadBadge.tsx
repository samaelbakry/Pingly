type UnreadBadgeProps = {
  count: number;
};

export default function UnreadBadge({
  count,
}: UnreadBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      aria-label={`${count} unread messages`}
      className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-white shadow-sm"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}