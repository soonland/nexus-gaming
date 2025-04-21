import type { SocialPlatform } from '@prisma/client';
import {
  FaBattleNet,
  FaInstagram,
  FaPlaystation,
  FaSteam,
  FaTiktok,
  FaTwitch,
  FaTwitter,
  FaXbox,
  FaYoutube,
} from 'react-icons/fa';
import { SiEpicgames, SiNintendoswitch } from 'react-icons/si';

export const GAMING_PLATFORMS = [
  'PSN',
  'XBOX',
  'STEAM',
  'NINTENDO',
  'EPIC',
  'BATTLENET',
] as const;

export const SOCIAL_PLATFORMS = [
  'TWITCH',
  'TWITTER',
  'INSTAGRAM',
  'TIKTOK',
  'YOUTUBE',
] as const;

export const socialIcons: Record<SocialPlatform, React.ElementType> = {
  TWITCH: FaTwitch,
  TWITTER: FaTwitter,
  YOUTUBE: FaYoutube,
  INSTAGRAM: FaInstagram,
  TIKTOK: FaTiktok,
  STEAM: FaSteam,
  XBOX: FaXbox,
  PSN: FaPlaystation,
  BATTLENET: FaBattleNet,
  EPIC: SiEpicgames,
  NINTENDO: SiNintendoswitch,
};
