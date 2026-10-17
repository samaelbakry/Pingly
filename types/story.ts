export type Story = {
  id: string;
  ownerId: string;
  mediaUrl: string;
  caption?: string;
  createdAt: number;
  expiresAt: number;
};

export type StoryView = {
  viewerId: string;
  viewedAt: number;
};
