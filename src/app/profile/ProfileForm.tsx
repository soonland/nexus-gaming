import { Stack } from '@mui/material';

import { AvatarSection } from './_components/AvatarSection';
import { BasicInfoForm } from './_components/BasicInfoForm';
import { PasswordExpiration } from './_components/PasswordExpiration';
import { PasswordForm } from './_components/PasswordForm';
import {
  GAMING_PLATFORMS,
  SOCIAL_PLATFORMS,
} from './_components/social/constants';
import { SocialProfilesSection } from './_components/social/SocialProfilesSection';

export const ProfileForm = () => {
  return (
    <Stack spacing={3}>
      <PasswordExpiration />
      <AvatarSection />
      <BasicInfoForm />
      <SocialProfilesSection
        platforms={[...GAMING_PLATFORMS, ...SOCIAL_PLATFORMS]}
        section='all'
        title='Réseaux & plateformes'
      />
      <PasswordForm />
    </Stack>
  );
};
