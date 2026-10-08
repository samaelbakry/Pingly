"use client";

import { useTheme } from "@/context/ThemeProvider";
import { Check, Laptop, Moon, Sun } from "lucide-react";

const appearanceOptions = [
  {
    value: "light" as const,
    label: "Light",
    description: "Always use light mode",
    icon: Sun,
  },
  {
    value: "dark" as const,
    label: "Dark",
    description: "Always use dark mode",
    icon: Moon,
  },
  {
    value: "system" as const,
    label: "Auto",
    description: "Follow your device settings",
    icon: Laptop,
  },
];

export default function ProfileAppearance() {
  const { theme, setTheme } = useTheme();

  return (
    <section className="relative flex chat-scroll h-full min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <header className="mb-8 flex items-start gap-4 border-b border-zinc-200/70 pb-6 dark:border-zinc-800">
          <span className="mt-1 h-10 w-1.5 shrink-0 rounded-full bg-orange-500" />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Appearance
            </h2>
            <p className="mt-1.5 max-w-md text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Choose how Pingly looks on your device.
            </p>
          </div>
        </header>

        <div
          role="radiogroup"
          aria-label="Theme"
          className="grid gap-4 sm:grid-cols-3"
        >
          {appearanceOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setTheme(option.value)}
                className={`
              group relative flex flex-col overflow-hidden rounded-[2rem] border text-left
              transition-all duration-300 active:scale-[0.98]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60
              ${
                isActive
                  ? "border-orange-400/60 bg-white/70 shadow-[0_14px_40px_rgba(249,115,22,0.14)] dark:border-orange-500/40 dark:bg-zinc-900/70"
                  : "border-zinc-200/80 bg-white/40 hover:border-orange-200 hover:bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60"
              }
            `}
              >
                <div
                  className={`
                relative flex h-32 items-center justify-center transition-colors duration-300
                ${
                  isActive
                    ? "bg-linear-to-br from-orange-100/80 to-orange-50/30 dark:from-orange-500/15 dark:to-orange-500/5"
                    : "bg-zinc-100/70 dark:bg-zinc-800/50"
                }
              `}
                >
                  <div
                    className={`
                  flex h-16 w-16 items-center justify-center rounded-[1.25rem]
                  transition-all duration-300
                  ${
                    isActive
                      ? "scale-105 bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                      : "bg-white text-zinc-500 shadow-sm group-hover:scale-105 dark:bg-zinc-900 dark:text-zinc-400"
                  }
                `}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <p
                      className={`
                    truncate text-base font-bold
                    ${
                      isActive
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-zinc-800 dark:text-zinc-100"
                    }
                  `}
                    >
                      {option.label}
                    </p>
                    <p className="mt-0.5 text-xs font-medium leading-snug text-zinc-400 dark:text-zinc-500">
                      {option.description}
                    </p>
                  </div>

                  <span
                    className={`
                  flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2
                  transition-all duration-300
                  ${
                    isActive
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-zinc-300 text-transparent dark:border-zinc-700"
                  }
                `}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
