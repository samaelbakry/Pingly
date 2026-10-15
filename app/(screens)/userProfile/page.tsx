"use client";

import ChatNavRail from "@/components/chat/layout/ChatNavRail";
import Navbar from "@/components/common/Navbar";
import ManageAccount from "@/components/profile/features/manage-account/ManageAccount";
import Notifications from "@/components/profile/features/Notifications";
import Privacy from "@/components/profile/features/privacy/Privacy";
import ProfileAppearance from "@/components/profile/features/ProfileAppearance";
import ProfileContent from "@/components/profile/features/ProfileContent";
import ProfileSidebar from "@/components/profile/features/ProfileSidebar";
import { useState } from "react";

export default function UserProfile() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div
      className="
        flex flex-col overflow-hidden
        h-screen min-h-0 w-full
        text-slate-800
        bg-slate-50/50
        relative selection:bg-orange-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-100
      "
    >
      <div
        className="
          z-20
          w-250 h-150
          bg-linear-to-tr from-amber-300/40 via-orange-300/40 to-red-300/40
          rounded-full
          pointer-events-none
          absolute top-0 left-1/2 -translate-x-1/2 dark:from-amber-500/10 dark:via-orange-600/10 dark:to-red-600/10 blur-[130px]
        "
      />
      <div
        className="
          w-96 h-96
          bg-orange-400/30
          rounded-full
          pointer-events-none
          absolute top-1/3 -left-32 dark:bg-orange-600/15 blur-[120px]
        "
      />
      <div
        className="
          w-125 h-125
          bg-rose-400/25
          rounded-full
          pointer-events-none
          absolute bottom-10 -right-32 dark:bg-rose-600/15 blur-[140px]
        "
      />

      <Navbar />

      <main
        className="
          z-50 flex flex-1 flex-col overflow-hidden
          min-h-0 min-w-0 w-full max-w-8xl
          mx-auto p-2 pb-20
          relative gap-2
          sm:p-4 sm:pb-20 sm:gap-3
          md:flex-row md:p-6 md:pb-6 md:gap-4
        "
      >
        <ChatNavRail showArchived={false} setShowArchived={() => {}} />

        <div
          className="
            z-50 flex
            min-h-0 min-w-0 w-full
            relative shrink-0
            md:w-72
          "
        >
          <ProfileSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>
        <section
          className="
            flex-1 overflow-hidden
            min-h-0 min-w-0 w-full
            py-1
            relative
          "
        >
          {activeSection === "profile" && <ProfileContent />}
          {activeSection === "account" && <ManageAccount />}
          {activeSection === "appearance" && <ProfileAppearance />}
          {activeSection === "privacy" && <Privacy />}
          {activeSection === "notifications" && <Notifications />}
        </section>
      </main>
    </div>
  );
}
