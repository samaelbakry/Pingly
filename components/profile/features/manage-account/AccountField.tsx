"use client";

import type { LucideIcon } from "lucide-react";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  icon: LucideIcon;
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  disabled?: boolean;
};

export default function AccountField({
  id,
  label,
  value,
  onChange,
  icon: Icon,
  type = "text",
  placeholder,
  disabled = false,
}: Props) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/30">
          <Icon className="h-3.5 w-3.5 text-orange-500" />
        </span>

        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="
          h-12 w-full rounded-2xl border border-zinc-200
          bg-white/80 px-4 text-sm outline-none transition-all
          focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10
          disabled:cursor-not-allowed disabled:bg-zinc-100/70
          disabled:text-zinc-500
          dark:border-zinc-800 dark:bg-zinc-900/70
          dark:text-zinc-100 dark:disabled:bg-zinc-900/50
        "
      />
    </div>
  );
}