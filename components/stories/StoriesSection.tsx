"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

import { Loader2, Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

import { getUserChats } from "@/services/chats";
import { createStory, listenToStoriesForUsers } from "@/services/stories";
import { uploadImage } from "@/services/uploads";
import { getUserById } from "@/services/users";

import type { Story } from "@/types/story";
import type { UserProfile } from "@/types/userProfile";

import { toast } from "sonner";
import StoriesViewer from "./StoriesViewer";

type StoryOwner = Pick<UserProfile, "uid" | "name" | "photoURL">;

type StoryEntry = {
  story: Story;
  owner: StoryOwner;
};

type ViewerState = {
  queue: StoryEntry[];
  index: number;
};

export default function StoriesSection() {
  const { user: currentUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [myProfile, setMyProfile] = useState<StoryOwner | null>(null);
  const [contacts, setContacts] = useState<UserProfile[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [uploading, setUploading] = useState(false);
  const [viewer, setViewer] = useState<ViewerState | null>(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    let cancelled = false;

    async function loadContacts() {
      try {
        const [profile, chats] = await Promise.all([
          getUserById(currentUser!.uid),
          getUserChats(currentUser!.uid),
        ]);

        const contactIds = new Set(
          chats
            .flatMap((chat) => Object.keys(chat.participants ?? {}))
            .filter((uid) => uid !== currentUser!.uid),
        );

        const profiles = await Promise.all(
          [...contactIds].map(async (uid) => {
            try {
              return await getUserById(uid);
            } catch {
              return null;
            }
          }),
        );

        if (cancelled) return;

        setMyProfile(
          profile
            ? {
                uid: profile.uid,
                name: profile.name,
                photoURL: profile.photoURL,
              }
            : {
                uid: currentUser!.uid,
                name: currentUser!.displayName || "You",
                photoURL: currentUser!.photoURL || "",
              },
        );

        setContacts(
          profiles.filter((profile): profile is UserProfile =>
            Boolean(profile),
          ),
        );
      } catch (error) {
        console.error("Failed to load story contacts:", error);
        if (!cancelled) toast.error("Failed to load story contacts");
      }
    }

    void loadContacts();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    const ownerIds = [
      currentUser.uid,
      ...contacts.map((contact) => contact.uid),
    ];

    return listenToStoriesForUsers(ownerIds, setStories);
  }, [currentUser?.uid, contacts]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStories((current) =>
        current.filter((story) => story.expiresAt > Date.now()),
      );
    }, 30_000);

    return () => clearInterval(timer);
  }, []);

  const myQueue = useMemo<StoryEntry[]>(
    () =>
      myProfile
        ? stories
            .filter((story) => story.ownerId === myProfile.uid)
            .map((story) => ({ story, owner: myProfile }))
        : [],
    [stories, myProfile],
  );

  const contactsQueue = useMemo<StoryEntry[]>(
    () =>
      contacts.flatMap((contact) =>
        stories
          .filter((story) => story.ownerId === contact.uid)
          .map((story) => ({
            story,
            owner: {
              uid: contact.uid,
              name: contact.name,
              photoURL: contact.photoURL,
            },
          })),
      ),
    [contacts, stories],
  );

  const openMyStories = () => {
    if (myQueue.length > 0) {
      setViewer({ queue: myQueue, index: 0 });
    } else {
      fileInputRef.current?.click();
    }
  };

  const openContactStories = (contactId: string) => {
    const index = contactsQueue.findIndex(
      (entry) => entry.owner.uid === contactId,
    );

    if (index !== -1) {
      setViewer({ queue: contactsQueue, index });
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !currentUser?.uid) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const mediaUrl = await uploadImage(file);
      await createStory(currentUser.uid, mediaUrl);

      toast.success("Story added successfully");
    } catch (error) {
      console.error("Failed to add story:", error);
      toast.error("Failed to upload story");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <section className="w-full min-w-0 shrink-0 mx-10">
      <div className="mb-1.5 flex items-center justify-between px-1">
        {uploading && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-500" />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleImageChange}
        disabled={uploading}
      />

      <div className="chat-scroll flex snap-x items-start gap-3 overflow-x-auto overflow-y-hidden px-3 py-1.5 sm:gap-4 sm:px-4">
        {/* Your story */}
        <div className="flex w-14 shrink-0 snap-start flex-col items-center gap-1.5 sm:w-16">
          <div className="relative size-14 sm:size-16">
            <button
              type="button"
              onClick={openMyStories}
              disabled={uploading}
              aria-label={myQueue.length ? "View your stories" : "Add a story"}
              className={`flex size-full items-center justify-center rounded-full p-[2.5px] transition-transform hover:scale-105 active:scale-95 disabled:opacity-60 ${
                myQueue.length
                  ? "bg-linear-to-tr from-orange-500 via-amber-400 to-orange-500"
                  : "border-2 border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
              }`}
            >
              <Avatar className="size-full border-2 border-white dark:border-zinc-950">
                <AvatarImage
                  src={myProfile?.photoURL || undefined}
                  alt="Your profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-orange-500/10 text-sm font-bold text-orange-500 sm:text-base">
                  {myProfile?.name?.charAt(0).toUpperCase() || "Y"}
                </AvatarFallback>
              </Avatar>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="Add to story"
              className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full border-2 border-white bg-sky-500 text-white shadow-sm transition-transform hover:scale-110 active:scale-95 disabled:opacity-60 sm:size-6 dark:border-zinc-950"
            >
              <Plus className="size-3 sm:size-3.5" strokeWidth={3} />
            </button>
          </div>

          <span className="w-full truncate text-center text-[11px] font-medium text-zinc-700 sm:text-xs dark:text-zinc-300">
            Your story
          </span>
        </div>

        {contacts.map((contact) => {
          const hasStory = contactsQueue.some(
            (entry) => entry.owner.uid === contact.uid,
          );

          if (!hasStory) return null;

          return (
            <button
              key={contact.uid}
              type="button"
              onClick={() => openContactStories(contact.uid)}
              className="flex w-14 shrink-0 snap-start flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 sm:w-16"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-linear-to-tr from-orange-500 via-pink-500 to-amber-400 p-[2.5px] sm:size-16">
                <Avatar className="size-full border-2 border-white dark:border-zinc-950">
                  <AvatarImage
                    src={contact.photoURL || undefined}
                    alt={contact.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-zinc-100 text-sm font-bold text-zinc-600 sm:text-base dark:bg-zinc-800 dark:text-zinc-300">
                    {contact.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </span>

              <span className="w-full truncate text-center text-[11px] font-medium text-zinc-700 sm:text-xs dark:text-zinc-300">
                {contact.name.split(" ")[0]}
              </span>
            </button>
          );
        })}

        {myQueue.length === 0 && contactsQueue.length === 0 && (
          <div className="flex min-h-14 items-center px-1 sm:min-h-16">
            <p className="text-[11px] text-zinc-400 sm:text-xs dark:text-zinc-500">
              No other stories yet
            </p>
          </div>
        )}
      </div>

      {viewer && (
        <StoriesViewer
          queue={viewer.queue}
          index={viewer.index}
          currentUserId={currentUser?.uid ?? ""}
          onIndexChange={(index: number) => {
            if (index < 0 || index >= viewer.queue.length) {
              setViewer(null);
              return;
            }

            setViewer((current) => (current ? { ...current, index } : null));
          }}
          onClose={() => setViewer(null)}
        />
      )}
    </section>
  );
}
