import {
  Bell,
  Lock,
  Palette,
  Settings,
  UserRound,
} from "lucide-react";

export const profileSections = [
  {
    id: "profile",
    label: "Profile",
    description: "Your personal information",
    icon: UserRound,
  },
  {
    id: "account",
    label: "Account",
    description: "Manage your account",
    icon: Settings,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Customize your experience",
    icon: Palette,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Manage your alerts",
    icon: Bell,
  },
  {
    id: "privacy",
    label: "Privacy",
    description: "Control your privacy",
    icon: Lock,
  },
];