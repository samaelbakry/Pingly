"use client";

import ChatNavRail from "@/components/chat/layout/ChatNavRail";
import Navbar from "@/components/common/Navbar";
import ManageAccount from "@/components/profile/features/ManageAccount";
import Privacy from "@/components/profile/features/Privacy";
import ProfileAppearance from "@/components/profile/features/ProfileAppearance";
import ProfileContent from "@/components/profile/features/ProfileContent";
import ProfileSidebar from "@/components/profile/features/ProfileSidebar";
import { useState } from "react";

export default function UserProfile() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div
      className="
        relative
        flex
        h-screen
        min-h-0
        w-full
        flex-col
        overflow-hidden
        bg-slate-50/50
        text-slate-800
        selection:bg-orange-500
        selection:text-white

        dark:bg-zinc-950
        dark:text-zinc-100
      "
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-linear-to-tr from-amber-300/40 via-orange-300/40 to-red-300/40 dark:from-amber-500/10 dark:via-orange-600/10 dark:to-red-600/10 blur-[130px] rounded-full pointer-events-none z-20" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-orange-400/30 dark:bg-orange-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-125 h-125 bg-rose-400/25 dark:bg-rose-600/15 blur-[140px] rounded-full pointer-events-none" />

      <Navbar />

      <main
        className="
    relative
    z-50
    mx-auto
    flex
    min-h-0
    min-w-0
    w-full
    max-w-8xl
    flex-1
    flex-col
    gap-2
    overflow-hidden
    p-2
    pb-20

    sm:gap-3
    sm:p-4
    sm:pb-20

    md:flex-row
    md:gap-4
    md:p-6
    md:pb-6
  "
      >
        <ChatNavRail showArchived={false} setShowArchived={() => {}} />

        <div className="relative z-50 flex min-h-0 min-w-0 w-full shrink-0 md:w-72">
          <ProfileSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>
        <section
          className="
    relative
    min-h-0
    min-w-0
    w-full
    flex-1
    overflow-hidden
    py-1
  "
        >
          {activeSection === "profile" && <ProfileContent />}
          {activeSection === "account" && <ManageAccount />}
          {activeSection === "appearance" && <ProfileAppearance />}
          {activeSection === "privacy" && <Privacy />}
        </section>
      </main>
    </div>
  );
}
