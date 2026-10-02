"use client";

import ChatNavRail from "@/components/chat/layout/ChatNavRail";
import ProfileSidebar from "@/components/profile/features/ProfileSidebar";
import ProfileContent from "@/components/profile/features/ProfileContent";
import Navbar from "@/components/common/Navbar";
import { useState } from "react";
import ManageAccount from "@/components/profile/features/ManageAccount";

export default function UserProfile() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-slate-50/50 text-slate-800 selection:bg-orange-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-100 w-150 -translate-x-1/2 rounded-full bg-linear-to-tr from-amber-400/20 via-orange-400/20 to-red-400/20 blur-[140px] dark:from-amber-600/10 dark:via-orange-600/10 dark:to-red-600/10" />

      <div className="pointer-events-none absolute -left-32 top-1/3 z-0 h-96 w-96 rounded-full bg-orange-500/15 blur-[120px] dark:bg-orange-600/10" />

      <div className="pointer-events-none absolute -right-32 bottom-10 z-0 h-125 w-125 rounded-full bg-rose-500/15 blur-[150px] dark:bg-rose-600/10" />

      <Navbar />

      <main
        className="
          relative z-10
          flex min-h-0 flex-1
          w-full max-w-8xl mx-auto
          flex-col gap-3
          overflow-hidden
          p-3 pb-20

          sm:flex-row sm:gap-4 sm:p-6 sm:pb-6
        "
      >
        <ChatNavRail
          showArchived={false}
          setShowArchived={() => {}}
        />

        <div
          className="
            relative z-10
            flex min-h-0
            w-full shrink-0

            sm:w-72
          "
        >
          <ProfileSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        <section
          className="
            relative z-10
            min-h-0 min-w-0
            flex-1
            overflow-hidden
          "
        >
          {activeSection === "profile" && <ProfileContent />}

          {activeSection === "account" && <ManageAccount />}
        </section>
      </main>
    </div>
  );
}