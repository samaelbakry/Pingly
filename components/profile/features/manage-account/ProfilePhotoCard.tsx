"use client";

import {
  Camera,
  Loader2,
  UserRound,
  Sparkles,
} from "lucide-react";

import type { ChangeEvent } from "react";

type Props = {
  name: string;
  email: string;
  photoURL: string;
  bio: string;
  uploading: boolean;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function ProfilePhotoCard({
  name,
  email,
  photoURL,
  bio,
  uploading,
  onImageChange,
}: Props) {
  return (
    <div className="self-start relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/70 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-zinc-800/80 dark:bg-zinc-900/60">
      <div className="h-32 bg-linear-to-tr from-amber-400/40 via-orange-500/30 to-violet-600/30 dark:from-amber-500/20 dark:via-orange-600/20 dark:to-violet-600/20" />

      <div className="-mt-16 flex flex-col items-center px-6 pb-6">
        <div className="group relative">
          <div className="absolute -inset-1 rounded-full bg-linear-to-r from-orange-500 to-violet-600 opacity-70 blur-md transition-all duration-500 group-hover:opacity-100 group-hover:blur-lg" />

          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-zinc-100 shadow-2xl dark:border-zinc-900 dark:bg-zinc-800">
            {photoURL ? (
              <img
                src={photoURL}
                alt={name || "Profile"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <UserRound className="h-12 w-12 text-orange-500" />
            )}
          </div>

          <label
            htmlFor="profile-image"
            title="Change profile picture"
            aria-label="Change profile picture"
            aria-disabled={uploading}
            className={`
              absolute bottom-0 right-0 z-10
              flex h-10 w-10 items-center justify-center
              rounded-full border-4 border-white
              bg-linear-to-br from-orange-500 to-amber-400
              text-white shadow-lg
              transition-all duration-300
              dark:border-zinc-900
              ${
                uploading
                  ? "pointer-events-none cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:scale-110 hover:shadow-orange-500/30"
              }
            `}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </label>

          <input
            id="profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
            disabled={uploading}
          />
        </div>

        <div className="mt-4 w-full text-center">
          <h2 className="wrap-break-words text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
            {name || "Unnamed User"}
          </h2>

          <p className="mt-1 break-all text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {email || "No email provided"}
          </p>

          <p className="mt-2 text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
            {uploading
              ? "Uploading your new picture..."
              : "Click the camera to update your photo"}
          </p>
        </div>

        <div className="mt-6 w-full">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              About
            </span>
          </div>

          {bio.trim() ? (
            <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/50 p-4 transition-colors duration-300 hover:border-orange-200/80 dark:border-zinc-800/60 dark:bg-zinc-950/40 dark:hover:border-orange-500/20">
              <p className="whitespace-pre-wrap wrap-break-word text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {bio}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 p-5 text-center dark:border-zinc-800">
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                No bio added
              </p>

              <p className="mt-1 text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
                Write a little about yourself to show your personality.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}