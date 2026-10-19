import { database } from "@/lib/firebaseConfig";
import { Story, StoryView } from "@/types/story";
import { onValue, push, ref, runTransaction, set } from "firebase/database";

const STORY_DURATION = 24 * 60 * 60 * 1000;
export async function createStory(ownerId: string,mediaUrl: string,caption = ""): Promise<Story> {

  const storyRef = push(ref(database, `stories/${ownerId}`));

  if (!storyRef.key) {
    throw new Error("Could not create story");
  }

  const createdAt = Date.now();

  const story: Story = {
    id: storyRef.key,
    ownerId,
    mediaUrl,
    caption: caption.trim(),
    createdAt,
    expiresAt: createdAt + STORY_DURATION,
  };

  await set(storyRef, {
    mediaUrl: story.mediaUrl,
    caption: story.caption,
    createdAt: story.createdAt,
    expiresAt: story.expiresAt,
  });

  return story;
}

export function listenToStoriesForUsers( ownerIds: string[], onChange: (stories: Story[]) => void) {
  const latestByOwner: Record<string, Story[]> = {};

  const unsubscribers = [...new Set(ownerIds)].map((ownerId) =>
    onValue(
      ref(database, `stories/${ownerId}`),
      (snapshot) => {
        const data = snapshot.val() as
          | Record<
              string,
              Omit<Story, "id" | "ownerId">
            >
          | null;

        const now = Date.now();

        latestByOwner[ownerId] = Object.entries(data ?? {})
          .map(([id, story]) => ({
            ...story,
            id,
            ownerId,
          }))
          .filter(
            (story) =>
              Boolean(story.mediaUrl) &&
              Number.isFinite(story.expiresAt) &&
              story.expiresAt > now,
          )
          .sort((a, b) => a.createdAt - b.createdAt);

        onChange(
          Object.values(latestByOwner)
            .flat()
            .sort((a, b) => a.createdAt - b.createdAt),
        );
      },
      (error) => {
        console.error(`Failed to listen to stories for ${ownerId}:`, error);
      },
    ),
  );

  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
  };
}

export async function markStoryViewed(
  ownerId: string,
  storyId: string,
  viewerId: string,
) {
  if (ownerId === viewerId) return;

  const viewRef = ref(
    database,
    `storyViews/${ownerId}/${storyId}/${viewerId}`,
  );

  await runTransaction(
    viewRef,
    (current) => current ?? { viewedAt: Date.now() },
    { applyLocally: false },
  );
}

export function listenToStoryViewers( ownerId: string,  storyId: string, onChange: (viewers: StoryView[]) => void ) {
  return onValue(
    ref(database, `storyViews/${ownerId}/${storyId}`),
    (snapshot) => {
      const data = snapshot.val() as
        | Record<string, { viewedAt: number }>
        | null;

      const viewers = Object.entries(data ?? {})
        .map(([viewerId, view]) => ({
          viewerId,
          viewedAt: view.viewedAt,
        }))
        .sort((a, b) => a.viewedAt - b.viewedAt);

      onChange(viewers);
    },
    (error) => {
      console.error("Failed to load story viewers:", error);
    },
  );
}
