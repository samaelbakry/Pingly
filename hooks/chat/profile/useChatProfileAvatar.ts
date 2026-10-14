"use client";

import { useEffect, useState, type ChangeEvent } from "react";

import { useAuth } from "@/context/AuthContext";
import { listenToUserPresence } from "@/services/presence";
import { uploadImage } from "@/services/uploads";
import { updateGroupPhoto } from "@/services/groupChatActions";

import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";
import { toast } from "sonner";
import { useUserPrivacySettings } from "@/hooks/privacy/PrivacyVisibilitySettings/useUserPrivacySettings";

export type ChatProfilePresence = {
  state: "online" | "offline";
  lastSeen?: number;
};

type Props = {
  selectedUser: UserProfile | null;
  selectedGroup: ChatItem | null;
  isGroupChat: boolean;
};

export function useChatProfileAvatar({
  selectedUser,
  selectedGroup,
  isGroupChat,
}: Props) {
  const { user: currentUser } = useAuth();
  const { settings: targetPrivacy } = useUserPrivacySettings(
    !isGroupChat ? selectedUser?.uid : undefined,
  );

  const { settings: viewerPrivacy } = useUserPrivacySettings(currentUser?.uid);

  const [presence, setPresence] = useState<ChatProfilePresence | null>(null);

  const [uploading, setUploading] = useState(false);
  const [groupPhoto, setGroupPhoto] = useState("");

  const canSeeProfilePhoto =
    isGroupChat ||
    selectedUser?.uid === currentUser?.uid ||
    targetPrivacy?.profilePhoto === "everyone";
  const canSeePresence =
    !isGroupChat &&
    targetPrivacy?.lastSeen === "everyone" &&
    viewerPrivacy?.lastSeen === "everyone";

  const displayName = isGroupChat
    ? selectedGroup?.name || "Unnamed Group"
    : selectedUser?.name || "Unknown User";

  const displayPhoto = isGroupChat
    ? groupPhoto
    : canSeeProfilePhoto
      ? selectedUser?.photoURL || ""
      : "";

  const isOnline = presence?.state === "online";

  const canUpdateGroupPhoto = Boolean(
    isGroupChat && selectedGroup?.createdBy === currentUser?.uid && !uploading,
  );

  const handleGroupImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    if (isGroupChat || !selectedUser?.uid || !canSeePresence) {
      return;
    }

    const unsubscribe = listenToUserPresence(
      selectedUser.uid,
      (currentPresence) => {
        setPresence(currentPresence);
      },
    );

    return unsubscribe;
  }, [selectedUser?.uid, isGroupChat , canSeePresence]);


  return {
    presence,
    isOnline,
    groupPhoto,
    displayName,
    displayPhoto,
    uploading,
    canUpdateGroupPhoto,
    handleGroupImageChange,
    canSeePresence,
  };
}
