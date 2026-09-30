import { UserProfile } from "@/types/userProfile";

type Props = {
  sender?: UserProfile;
  isGroupChat: boolean;
};

export default function MessageAvatar({
  sender,
  isGroupChat,
}: Props) {
  if (!isGroupChat) {
    return <div className="w-7 shrink-0" />;
  }

  const name = sender?.name || "Unknown User";

  return (
    <div className="mb-6 shrink-0">
      {sender?.photoURL ? (
        <img
          src={sender.photoURL}
          alt={name}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm dark:ring-zinc-900"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-[11px] font-bold text-orange-600 ring-2 ring-white shadow-sm dark:bg-orange-950/60 dark:text-orange-400 dark:ring-zinc-900">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}