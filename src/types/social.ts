import type { SocialPlatform } from '@prisma/client';

export interface IUserSocialProfileData {
  platform: SocialPlatform;
  username: string;
}

export interface IUserSocialProfile extends IUserSocialProfileData {
  id: string;
  url: string | null;
  userId: string;
}
