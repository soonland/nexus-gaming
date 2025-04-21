import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import type { SocialPlatform } from '@prisma/client';
import { useState } from 'react';

import { useNotifier } from '@/components/common/Notifier';
import { useSocialProfiles } from '@/hooks/useSocialProfiles';

import { GAMING_PLATFORMS } from './constants';
import { SocialProfileField } from './SocialProfileField';
import type { ISocialProfilesProps, SocialProfilesState } from './types';

export const SocialProfilesSection = ({
  platforms,
  section,
  title,
}: ISocialProfilesProps) => {
  const { profiles, updateProfiles } = useSocialProfiles();
  const { showSuccess, showError } = useNotifier();

  // État local pour les profils sociaux avec suivi des modifications
  const [socialProfilesState, setSocialProfilesState] =
    useState<SocialProfilesState>(() =>
      platforms.reduce((acc, platform) => {
        acc[platform] = {
          value: profiles?.[platform] || '',
          isDirty: false,
        };
        return acc;
      }, {} as SocialProfilesState)
    );

  const handleSocialProfileChange = (
    platform: SocialPlatform,
    value: string
  ) => {
    setSocialProfilesState(prev => {
      const newState = { ...prev };
      newState[platform] = {
        value,
        isDirty: value !== (profiles?.[platform] || ''),
      };
      return newState;
    });
  };

  const handleClearProfile = (platform: SocialPlatform) => {
    setSocialProfilesState(prev => {
      const newState = { ...prev };
      newState[platform] = {
        value: '',
        isDirty: true,
      };
      return newState;
    });
  };

  const getDirtyProfiles = () => {
    return Object.entries(socialProfilesState)
      .filter(([, state]) => state.isDirty)
      .map(([platform, state]) => ({
        platform: platform as SocialPlatform,
        value: state.value || null,
      }));
  };

  const handleSave = async () => {
    const dirtyProfiles = getDirtyProfiles();
    if (dirtyProfiles.length === 0) return;

    try {
      await updateProfiles.mutateAsync(dirtyProfiles);
      // Réinitialiser l'état "dirty" pour les profils mis à jour
      setSocialProfilesState(prev => {
        const newState = { ...prev } as SocialProfilesState;
        for (const [platform, state] of Object.entries(prev)) {
          newState[platform as SocialPlatform] = {
            ...state,
            isDirty: !dirtyProfiles.some(p => p.platform === platform),
          };
        }
        return newState;
      });
      showSuccess('Profils sociaux mis à jour avec succès');
    } catch (error) {
      showError('Erreur lors de la mise à jour des profils sociaux');
    }
  };

  const dirtyCount = getDirtyProfiles().length;

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant='h6'>
          {title}
        </Typography>
        <Stack divider={<Divider />} spacing={1}>
          {platforms.map(platform => (
            <SocialProfileField
              key={platform}
              isGaming={
                section === 'gaming' ||
                (section === 'all' &&
                  GAMING_PLATFORMS.includes(
                    platform as (typeof GAMING_PLATFORMS)[number]
                  ))
              }
              platform={platform}
              state={socialProfilesState[platform]}
              onChange={value => handleSocialProfileChange(platform, value)}
              onClear={() => handleClearProfile(platform)}
            />
          ))}
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <Button
          disabled={updateProfiles.isPending || dirtyCount === 0}
          size='small'
          variant='contained'
          onClick={handleSave}
        >
          {updateProfiles.isPending ? (
            <Box alignItems='center' display='flex' gap={1}>
              <CircularProgress size={16} />
              <span>Sauvegarde...</span>
            </Box>
          ) : (
            'Sauvegarder'
          )}
        </Button>
      </CardActions>
    </Card>
  );
};
