
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getUserById } from "@/services/users";
import {
  listenToStoryViewers,
  markStoryViewed,
} from "@/services/stories";

import type { UserProfile } from "@/types/userProfile";
import type { Story } from "@/types/story";

type StoryOwner = Pick<UserProfile, "uid" | "name" | "photoURL">;

type StoryEntry = {
  story: Story;
  owner: StoryOwner;
};

type Props = {
  queue: StoryEntry[];
  index: number;
  currentUserId: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

type ViewerProfile = {
  user: Pick<UserProfile, "uid" | "name" | "photoURL">;
  viewedAt: number;
};

export default function StoriesViewer({
  queue,
  index,
  currentUserId,
  onIndexChange,
  onClose,
}: Props) {
  const [viewers, setViewers] = useState<ViewerProfile[]>([]);
  const [showViewers, setShowViewers] = useState(false);

  const current = queue[index];
  const story = current?.story;
  const owner = current?.owner;

  const isOwner = story?.ownerId === currentUserId;

  useEffect(() => {
    if (!story || !owner || isOwner) return;

    void markStoryViewed(
      story.ownerId,
      story.id,
      currentUserId,
    ).catch((error) => {
      console.error("Failed to record story view:", error);
    });
  }, [story?.id, story?.ownerId, owner?.uid, currentUserId, isOwner]);

  useEffect(() => {
    if (!story || !owner || !isOwner) {
      return;
    }

    return listenToStoryViewers(owner.uid, story.id, (records) => {
      let cancelled = false;

      const loadViewers = async () => {
        const profiles = await Promise.all(
          records.map(async (record) => {
            try {
              const profile = await getUserById(record.viewerId);

              if (!profile) return null;

              return {
                user: {
                  uid: profile.uid,
                  name: profile.name,
                  photoURL: profile.photoURL,
                },
                viewedAt: record.viewedAt,
              };
            } catch {
              return null;
            }
          }),
        );

        if (!cancelled) {
          setViewers(
            profiles.filter(
              (profile): profile is ViewerProfile => Boolean(profile),
            ),
          );
        }
      };

      void loadViewers();

      return () => {
        cancelled = true;
      };
    });
  }, [story?.id, owner?.uid, isOwner]);

  useEffect(() => {
    if (!story) return;

    const remaining = story.expiresAt - Date.now();

    if (remaining <= 0) {
      onClose();
      return;
    }

    const timer = setTimeout(onClose, remaining);

    return () => clearTimeout(timer);
  }, [story?.id, story?.expiresAt, onClose]);

  if (!story || !owner) return null;

  const move = (direction: -1 | 1) => {
    onIndexChange(index + direction);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Story viewer"
      className="fixed inset-0 z-[100]  flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="relative flex h-[min(88dvh,54rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="absolute inset-x-0 top-0 z-20 bg-linear-to-b from-black/75 to-transparent p-4">
          <div className="mb-4 h-1 overflow-hidden rounded-full bg-white/30">
            <div className="h-full w-full rounded-full bg-white" />
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/20">
              <AvatarImage
                src={owner.photoURL || undefined}
                alt={owner.name}
              />
              <AvatarFallback>
                {owner.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">
                {owner.uid === currentUserId ? "Your story" : owner.name}
              </p>
              <p className="text-[11px] text-white/70">
                {new Date(story.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close story"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-white/15"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
          <img
            src={story.mediaUrl}
            alt={story.caption || "Story"}
            className="absolute inset-0 h-full w-full object-contain"
          />

          <button
            type="button"
            onClick={() => move(-1)}
            disabled={index === 0}
            aria-label="Previous story"
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/60 disabled:opacity-20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() => move(1)}
            disabled={index === queue.length - 1}
            aria-label="Next story"
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/60 disabled:opacity-20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {story.caption && (
            <p className="absolute bottom-5 left-4 right-4 z-10 rounded-xl bg-black/40 px-4 py-3 text-center text-sm text-white backdrop-blur-sm">
              {story.caption}
            </p>
          )}
        </div>

        {isOwner && (
          <div className="border-t border-white/10 bg-zinc-950 p-3">
            <button
              type="button"
              onClick={() => setShowViewers((value) => !value)}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Eye className="h-4 w-4 text-orange-400" />
              {viewers.length} {viewers.length === 1 ? "view" : "views"}
              <span className="text-xs text-white/50">
                · {showViewers ? "Hide viewers" : "See who viewed"}
              </span>
            </button>

            {showViewers && (
              <div className="chat-scroll max-h-36 space-y-1 overflow-y-auto pt-2">
                {viewers.length > 0 ? (
                  viewers.map(({ user, viewedAt }) => (
                    <div
                      key={user.uid}
                      className="flex items-center gap-3 rounded-xl px-2 py-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.photoURL || undefined}
                          alt={user.name}
                        />
                        <AvatarFallback>
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-white">
                        {user.name}
                      </span>

                      <span className="text-[10px] text-white/50">
                        {new Date(viewedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="px-2 py-3 text-center text-xs text-white/50">
                    Nobody has viewed this story yet.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
