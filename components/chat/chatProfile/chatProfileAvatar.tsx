
"use client";

import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";


import { useChatProfileAvatar } from "@/hooks/chat/profile/useChatProfileAvatar";
import ChatGroupProfile from "./chatGroupProfile";
import ChatDirectProfile from "./chatDirectProfile";

type Props = {
  selectedUser: UserProfile | null;
  selectedGroup: ChatItem | null;
  isGroupChat: boolean;
  groupMembers: UserProfile[];
};

export default function ChatProfileAvatar({ selectedUser, selectedGroup, isGroupChat, groupMembers}: Props) {
  const {
    presence,
    displayName,
    displayPhoto,
    uploading,
    canUpdateGroupPhoto,
    handleGroupImageChange,
    canSeePresence
  } = useChatProfileAvatar({
    selectedUser,
    selectedGroup,
    isGroupChat,
  });

  if (isGroupChat && selectedGroup) {
    return (
      <ChatGroupProfile
        selectedGroup={selectedGroup}
        groupMembers={groupMembers}
        displayName={displayName}
        displayPhoto={displayPhoto}
        canUpdateGroupPhoto={canUpdateGroupPhoto}
        uploading={uploading}
        onImageChange={handleGroupImageChange}
      />
    );
  }

  if (!selectedUser) {
    return null;
  }

  return (
    <ChatDirectProfile
      canSeePresence={canSeePresence}
      displayName={displayName}
      displayPhoto={displayPhoto}
      presence={presence}
    />
  );
}
