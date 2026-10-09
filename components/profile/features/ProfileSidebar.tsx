"use client";

import { profileSections } from "@/constants/profileData";
import { UserRound } from "lucide-react";

type ProfileSidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

export default function ProfileSidebar({
  activeSection,
  setActiveSection,
}: ProfileSidebarProps) {
  return (
    <aside
      className="
        relative
        flex
        w-full
        shrink-0
        flex-col
        overflow-hidden
        rounded-[2rem]
        border border-orange-100/70
        bg-white/55
        p-3
        shadow-[0_20px_70px_rgba(249,115,22,0.08)]
        backdrop-blur-2xl
        dark:border-zinc-800
        dark:bg-zinc-950/55
        dark:shadow-none
         chat-scroll
        sm:h-full
        sm:w-72
      "
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 px-2 pb-3 pt-1 sm:pb-5 sm:pt-2">
        <div className="flex items-center gap-3 ">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/20">
            <UserRound className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-[15px] font-bold tracking-tight text-zinc-900 dark:text-white">
              Settings
            </h2>

            <p className="mt-0.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
              Manage your account
            </p>
          </div>
        </div>
      </div>

      <nav
        className="
          relative z-10
          flex min-h-0
          gap-2
          overflow-x-auto
          overflow-y-hidden

          sm:flex-1
          sm:flex-col
          sm:space-y-1
          sm:overflow-x-hidden
          sm:overflow-y-auto
        "
      >
        {profileSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`
                group
                relative
                flex
                shrink-0
                items-center
                gap-3
                rounded-2xl
                px-3
                py-2.5
                text-left
                transition-all
                duration-200

                sm:w-full
                sm:py-3

                ${
                  isActive
                    ? "bg-linear-to-r from-orange-500/10 to-amber-400/10 shadow-sm"
                    : "hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80"
                }
              `}
            >
              {isActive && (
                <span
                  className="
                    absolute
                    left-0
                    top-1/2
                    h-7
                    w-1
                    -translate-y-1/2
                    rounded-r-full
                    bg-linear-to-b
                    from-orange-500
                    to-amber-400
                  "
                />
              )}

              <div
                className={`
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  transition-colors

                  ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "bg-zinc-100 text-zinc-400 group-hover:text-zinc-700 dark:bg-zinc-900 dark:text-zinc-500 dark:group-hover:text-zinc-200"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p
                  className={`
                    whitespace-nowrap
                    text-xs
                    font-bold
                    ${
                      isActive
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-zinc-700 dark:text-zinc-200"
                    }
                  `}
                >
                  {section.label}
                </p>

                <p className="mt-0.5 hidden truncate text-[10px] font-medium text-zinc-400 dark:text-zinc-500 sm:block">
                  {section.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
