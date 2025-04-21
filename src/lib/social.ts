import type { SocialPlatform } from '@prisma/client';

export const socialUrlTemplates: Record<SocialPlatform, string> = {
  TWITCH: 'https://twitch.tv/{username}',
  TWITTER: 'https://twitter.com/{username}',
  YOUTUBE: 'https://youtube.com/@{username}',
  INSTAGRAM: 'https://instagram.com/{username}',
  TIKTOK: 'https://tiktok.com/@{username}',
  STEAM: 'https://steamcommunity.com/id/{username}',
  XBOX: 'https://account.xbox.com/profile?gamertag={username}',
  PSN: 'https://psnprofiles.com/{username}',
  BATTLENET: 'https://battle.net/support',
  EPIC: 'https://epic.com/support',
  NINTENDO: 'https://accounts.nintendo.com',
};

export const socialPlaceholders: Record<SocialPlatform, string> = {
  TWITCH: 'Entrez votre pseudo (ex: acme)',
  TWITTER: 'Entrez votre @ (ex: @acme)',
  YOUTUBE: 'Entrez votre pseudo (ex: acme)',
  INSTAGRAM: 'Entrez votre @ (ex: @came)',
  TIKTOK: 'Entrez votre @ (ex: @acme)',
  STEAM: 'Entrez votre URL perso ou ID Steam',
  XBOX: 'Entrez votre gamertag Xbox',
  PSN: 'Entrez votre PSN ID',
  BATTLENET: 'Entrez votre BattleTag (ex: Acme#1234)',
  EPIC: 'Entrez votre pseudo Epic Games',
  NINTENDO: 'Entrez votre code ami Switch',
};

export const generateSocialUrl = (
  platform: SocialPlatform,
  username: string
): string | null => {
  if (!username) return null;

  // Supprimer le @ initial si présent
  const cleanUsername = username.startsWith('@') ? username.slice(1) : username;

  return socialUrlTemplates[platform].replace('{username}', cleanUsername);
};

export const extractUsername = (
  platform: SocialPlatform,
  url: string
): string | null => {
  try {
    const template = socialUrlTemplates[platform];
    const pattern = template
      .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
      .replace('{username}', '([^/]+)');
    const regex = new RegExp(pattern);
    const match = url.match(regex);
    return match?.[1] || null;
  } catch {
    return null;
  }
};

export const isValidSocialUrl = (
  platform: SocialPlatform,
  url: string
): boolean => {
  try {
    const template = socialUrlTemplates[platform];
    const pattern = template
      .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
      .replace('{username}', '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(url);
  } catch {
    return false;
  }
};
