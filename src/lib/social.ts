import type { SocialPlatform } from '@prisma/client';

export const generatePlatformUrl = (
  platform: SocialPlatform,
  username: string
): string | null => {
  const platformUrls: Record<
    SocialPlatform,
    ((username: string) => string) | null
  > = {
    PSN: null,
    XBOX: null,
    STEAM: username => `https://steamcommunity.com/id/${username}`,
    NINTENDO: null,
    EPIC: null,
    BATTLENET: null,
    TWITCH: username => `https://twitch.tv/${username}`,
    TWITTER: username => `https://twitter.com/${username}`,
    INSTAGRAM: username => `https://instagram.com/${username}`,
    TIKTOK: username => `https://tiktok.com/@${username}`,
    YOUTUBE: username => `https://youtube.com/@${username}`,
  };

  const urlGenerator = platformUrls[platform];
  return urlGenerator ? urlGenerator(username) : null;
};

export const cleanUsername = (username: string): string => {
  return username.trim().replace(/^@/, '');
};
