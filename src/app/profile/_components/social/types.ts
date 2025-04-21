import type { SocialPlatform } from '@prisma/client';

export interface ISocialProfileState {
  value: string;
  isDirty: boolean;
}

export type SocialProfilesState = Record<SocialPlatform, ISocialProfileState>;

export interface ISocialProfilesProps {
  title: string;
  platforms: readonly SocialPlatform[];
  section: 'gaming' | 'social' | 'all';
}

export interface ISocialProfileFieldProps {
  platform: SocialPlatform;
  state: ISocialProfileState;
  isGaming?: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
}
