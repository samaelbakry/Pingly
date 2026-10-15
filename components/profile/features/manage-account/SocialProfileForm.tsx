"use client";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type { SocialLinks } from "@/types/userProfile";

type Props = {
  bio: string;
  setBio: (value: string) => void;
  socialLinks: SocialLinks;
  setSocialLinks: Dispatch<SetStateAction<SocialLinks>>;
};

const socialFields = [
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/username",
  },
  {
    key: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@username",
  },
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/username",
  },
  {
    key: "x",
    label: "X",
    placeholder: "https://x.com/username",
  },
] satisfies {
  key: keyof SocialLinks;
  label: string;
  placeholder: string;
}[];

export default function SocialProfileForm({
  bio,
  setBio,
  socialLinks,
  setSocialLinks,
}: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
          About you
        </h3>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Tell people a little about yourself.
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <label
            htmlFor="account-bio"
            className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Bio
          </label>

          <span className="text-xs text-zinc-400">
            {bio.length}/160
          </span>
        </div>

        <textarea
          id="account-bio"
          value={bio}
          onChange={(event) =>
            setBio(event.target.value.slice(0, 160))
          }
          maxLength={160}
          rows={4}
          placeholder="A little about you... ✨"
          className="w-full resize-y rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100"
        />
      </div>

      <div className="border-t border-zinc-200/70 pt-5 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
          Social accounts
        </h3>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Add the profiles you want to share. All fields are optional.
        </p>
      </div>

      <div className="space-y-4">
        {socialFields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label
              htmlFor={`social-${key}`}
              className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
            >
              {label}
            </label>

            <input
              id={`social-${key}`}
              type="url"
              value={socialLinks[key] ?? ""}
              onChange={(event) =>
                setSocialLinks((previous) => ({
                  ...previous,
                  [key]: event.target.value,
                }))
              }
              placeholder={placeholder}
              maxLength={300}
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 text-sm outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}