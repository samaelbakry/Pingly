export type SocialLinks = {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  x?: string;
};

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  createdAt: number;
  bio?: string;
  socialLinks?: SocialLinks;
};