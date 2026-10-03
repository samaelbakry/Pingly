"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";
import { listenToUserPresence } from "@/services/presence";
import GroupInfoDialog from "../dialogs/GroupInfoDialog";
import { Camera, Edit, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadImage } from "@/services/uploads";
import { toast } from "sonner";
import { updateGroupPhoto } from "@/services/groupChatActions";

type Props = {
  selectedUser: UserProfile | null;
  selectedGroup: ChatItem | null;
  isGroupChat: boolean;
  groupMembers: UserProfile[];
};

type Presence = {
  state: "online" | "offline";
  lastSeen?: number;
};

export default function ChatProfileAvatar({
  selectedUser,
  selectedGroup,
  isGroupChat,
  groupMembers,
}: Props) {
  const [presence, setPresence] = useState<Presence | null>(null);
  const [uploading, setUploading] = useState(false);
  const [groupPhoto, setGroupPhoto] = useState("");
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (isGroupChat || !selectedUser?.uid) {
      return;
    }

    const unsubscribe = listenToUserPresence(
      selectedUser.uid,
      (currentPresence) => {
        setPresence(currentPresence);
      },
    );

    return () => unsubscribe();
  }, [selectedUser?.uid, isGroupChat]);

  useEffect(() => {
  if (isGroupChat) {
    setGroupPhoto(selectedGroup?.photoURL || "");
  }
}, [isGroupChat, selectedGroup?.photoURL]);

  const displayName = isGroupChat ? selectedGroup?.name || "Unnamed Group" : selectedUser?.name || "Unknown User";

  const displayPhoto = isGroupChat ? groupPhoto : selectedUser?.photoURL || "";

  const isOnline = presence?.state === "online";

  const handleGroupImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file || !currentUser?.uid || !selectedGroup?.chatId) {
      return;
    }

    try {
      setUploading(true);

      const newPhotoURL = await uploadImage(file);

      await updateGroupPhoto(
        selectedGroup.chatId,
        currentUser.uid,
        newPhotoURL,
      );
      setGroupPhoto(newPhotoURL);
      toast.success("Group picture updated");
    } catch (error) {
      console.error("Failed to update group picture:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update group picture",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const canUpdateGroupPhoto = isGroupChat && selectedGroup?.createdBy === currentUser?.uid && !uploading;

  return (
    <>
      {isGroupChat && selectedGroup ? (
        <div className="relative flex items-center">
          <GroupInfoDialog
            groupName={displayName}
            groupPhotoURL={displayPhoto}
            groupMembers={groupMembers}
            adminId={selectedGroup.createdBy}
          >
            <button
              type="button"
              className="group flex items-center gap-3.5 rounded-xl px-2 py-1.5 text-left transition-all duration-200 hover:bg-slate-100/60 dark:hover:bg-zinc-800/50"
            >
              <Avatar className="h-10 w-10 shrink-0 ring-2 ring-slate-200/60 transition-transform duration-300 group-hover:scale-105 dark:ring-zinc-700/60">
                <AvatarImage
                  src={displayPhoto}
                  alt={displayName}
                  className="object-cover"
                />

                <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-xs font-semibold tracking-wider text-white">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
                  {displayName}
                </h2>

                <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      {groupMembers.length}{" "}
                      {groupMembers.length === 1 ? "member" : "members"}
                    </span>

                    <span className="text-slate-300 dark:text-zinc-600">•</span>

                    <span className="truncate text-slate-400 dark:text-zinc-500">
                      {groupMembers.map((m) => m.name).join(", ") ||
                        "No members"}
                    </span>
                  </span>
                </p>
              </div>
            </button>
          </GroupInfoDialog>

          {canUpdateGroupPhoto && (
            <>
              <label
                htmlFor="group-image"
                title="Change group picture"
                className="absolute left-8 top-8 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-slate-500 to-slate-400 text-white shadow-md transition-all hover:scale-110 dark:border-zinc-950"
              >
                {uploading ? (
                  <Loader className="h-3 w-3 animate-spin" />
                ) : (
                  <Edit className="h-3 w-3" />
                )}
              </label>

              <input
                id="group-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleGroupImageChange}
                disabled={uploading}
              />
            </>
          )}
        </div>
      ) : (
        <div className="group flex cursor-pointer items-center gap-3.5 rounded-xl px-2 py-1.5 transition-all duration-200 hover:bg-slate-100/60 dark:hover:bg-zinc-800/50">
          <div className="relative shrink-0">
            <Avatar className="h-10 w-10 ring-2 ring-slate-200/60 transition-transform duration-300 group-hover:scale-105 dark:ring-zinc-700/60">
              <AvatarImage
                src={displayPhoto}
                alt={displayName}
                className="object-cover"
              />

              <AvatarFallback className="bg-linear-to-br from-amber-500 to-rose-500 text-xs font-semibold tracking-wider text-white">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
              {displayName}
            </h2>

            <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">
              <span
                className={`inline-block size-2 rounded-full ${
                  isOnline
                    ? "animate-pulse bg-emerald-500"
                    : "bg-slate-400 dark:bg-zinc-500"
                }`}
              />

              {isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
