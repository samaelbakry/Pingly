import { UserProfile } from "./userProfile";

export type SidebarChatsProps = {
  selectedUserId: string | null;
  setSelectedUserId: (userId: string | null) => void;
  setChatId: (chatId: string | null) => void;
  selectedUser: UserProfile | null;
  setSelectedUser: (user: UserProfile | null) => void;
};
