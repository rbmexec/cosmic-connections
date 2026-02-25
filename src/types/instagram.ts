export interface InstagramProfile {
  user_id: string;
  username: string;
  profile_picture_url?: string;
  biography?: string;
}

export interface InstagramMedia {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
}

export interface InstagramCachedData {
  profile: InstagramProfile;
  media: InstagramMedia[];
  fetchedAt: number;
}
