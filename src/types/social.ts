import type { SocialPlatform } from '@prisma/client';

export interface UserSocialProfileData {
  platform: SocialPlatform;
  username: string;
}

export interface UserSocialProfile extends UserSocialProfileData {
  id: string;
  url: string | null;
  userId: string;
}
