import { UserProfile } from "./userProfile";

export type SidebarChatsProps = {
  selectedUserId: string | null;
  setSelectedUser: (user: UserProfile | null) => void;
  setSelectedUserId: (userId: string | null) => void;
  selectedUser: UserProfile | null;
  setChatId: (chatId: string | null) => void;
};
