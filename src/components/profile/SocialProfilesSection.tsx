import {
  Input,
  Text,
  IconButton,
  HStack,
  VStack,
  useToast,
  Box,
  Divider,
} from '@chakra-ui/react';
import { SocialPlatform } from '@prisma/client';
import { useState, useEffect } from 'react';
import { FiSave, FiExternalLink, FiX } from 'react-icons/fi';

import { useSocialProfiles } from '@/hooks/useSocialProfiles';

interface PlatformField {
  value: string;
  isDirty: boolean;
  profileId?: string;
}

type PlatformFields = {
  [key in SocialPlatform]: PlatformField;
};

const GAMING_PLATFORMS = [
  SocialPlatform.PSN,
  SocialPlatform.XBOX,
  SocialPlatform.STEAM,
  SocialPlatform.NINTENDO,
  SocialPlatform.EPIC,
  SocialPlatform.BATTLENET,
];

const SOCIAL_PLATFORMS = [
  SocialPlatform.TWITCH,
  SocialPlatform.TWITTER,
  SocialPlatform.INSTAGRAM,
  SocialPlatform.TIKTOK,
  SocialPlatform.YOUTUBE,
];

export const SocialProfilesSection = () => {
  const toast = useToast();
  const {
    profiles,
    isLoading,
    createProfile,
    updateProfile,
    isCreating,
    isUpdating,
  } = useSocialProfiles();
  const [fields, setFields] = useState<PlatformFields>(() => {
    const initial: Partial<PlatformFields> = {};
    [...GAMING_PLATFORMS, ...SOCIAL_PLATFORMS].forEach(platform => {
      initial[platform] = { value: '', isDirty: false };
    });
    return initial as PlatformFields;
  });

  useEffect(() => {
    if (profiles) {
      setFields(prevFields => {
        const newFields = { ...prevFields };
        profiles.forEach(profile => {
          if (newFields[profile.platform]) {
            newFields[profile.platform] = {
              value: profile.username,
              isDirty: false,
              profileId: profile.id,
            };
          }
        });
        return newFields;
      });
    }
  }, [profiles]);

  const handleChange = (platform: SocialPlatform, value: string) => {
    setFields(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        value,
        isDirty:
          value !==
          (profiles?.find(p => p.platform === platform)?.username || ''),
      },
    }));
  };

  const handleCancel = (platform: SocialPlatform) => {
    const originalProfile = profiles?.find(p => p.platform === platform);
    setFields(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        value: originalProfile?.username || '',
        isDirty: false,
      },
    }));
  };

  const handleSave = (platform: SocialPlatform) => {
    const field = fields[platform];
    if (!field.isDirty) return;

    try {
      if (field.profileId) {
        updateProfile({
          id: field.profileId,
          data: { platform, username: field.value },
        });
      } else {
        createProfile({ platform, username: field.value });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const renderPlatformFields = (platforms: SocialPlatform[]) => {
    return platforms.map(platform => {
      const field = fields[platform];
      const profile = profiles?.find(p => p.platform === platform);

      return (
        <Box key={platform} mb={2}>
          <HStack align='center' spacing={4}>
            <Text fontSize='sm' fontWeight='medium' width='100px'>
              {platform}
            </Text>
            <Input
              flex={1}
              placeholder={`Votre ${platform}`}
              size='sm'
              value={field.value}
              onChange={e => handleChange(platform, e.target.value)}
            />
            <HStack spacing={1}>
              {field.isDirty && (
                <>
                  <IconButton
                    aria-label='Cancel'
                    icon={<FiX />}
                    size='sm'
                    variant='ghost'
                    onClick={() => handleCancel(platform)}
                  />
                  <IconButton
                    aria-label='Save'
                    colorScheme='blue'
                    icon={<FiSave />}
                    isLoading={isCreating || isUpdating}
                    size='sm'
                    onClick={() => handleSave(platform)}
                  />
                </>
              )}
              {profile?.url && !field.isDirty && (
                <IconButton
                  aria-label='Open profile'
                  icon={<FiExternalLink />}
                  size='sm'
                  variant='ghost'
                  onClick={() => window.open(profile.url || '', '_blank')}
                />
              )}
            </HStack>
          </HStack>
        </Box>
      );
    });
  };

  if (isLoading) {
    return <Text>Chargement...</Text>;
  }

  return (
    <VStack align='stretch' spacing={8}>
      <Box>
        <Text color='gray.500' fontSize='sm' fontWeight='medium' mb={4}>
          PLATEFORMES DE JEU
        </Text>
        <Divider mb={4} />
        {renderPlatformFields(GAMING_PLATFORMS)}
      </Box>

      <Box>
        <Text color='gray.500' fontSize='sm' fontWeight='medium' mb={4}>
          RÉSEAUX SOCIAUX
        </Text>
        <Divider mb={4} />
        {renderPlatformFields(SOCIAL_PLATFORMS)}
      </Box>
    </VStack>
  );
};
