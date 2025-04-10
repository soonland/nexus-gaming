import { Input, Text, IconButton, HStack, VStack, useToast, Box, Divider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { SocialPlatform } from "@prisma/client";
import { useSocialProfiles } from "@/hooks/useSocialProfiles";
import { FiSave, FiExternalLink, FiX } from "react-icons/fi";

interface PlatformField {
  value: string;
  isDirty: boolean;
  isLoading: boolean;
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

export function SocialProfilesSection() {
  const toast = useToast();
  const { profiles, isLoading, createProfile, updateProfile } = useSocialProfiles();
  const [fields, setFields] = useState<PlatformFields>(() => {
    const initial: Partial<PlatformFields> = {};
    [...GAMING_PLATFORMS, ...SOCIAL_PLATFORMS].forEach(platform => {
      initial[platform] = { value: "", isDirty: false, isLoading: false };
    });
    return initial as PlatformFields;
  });

  useEffect(() => {
    if (profiles) {
      const newFields = { ...fields };
      profiles.forEach(profile => {
        if (newFields[profile.platform]) {
          newFields[profile.platform] = {
            value: profile.username,
            isDirty: false,
            isLoading: false,
            profileId: profile.id
          };
        }
      });
      setFields(newFields);
    }
  }, [profiles]);

  const handleChange = (platform: SocialPlatform, value: string) => {
    setFields(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        value,
        isDirty: value !== (profiles?.find(p => p.platform === platform)?.username || "")
      }
    }));
  };

  const handleCancel = (platform: SocialPlatform) => {
    const originalProfile = profiles?.find(p => p.platform === platform);
    setFields(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        value: originalProfile?.username || "",
        isDirty: false
      }
    }));
  };

  const handleSave = async (platform: SocialPlatform) => {
    const field = fields[platform];
    if (!field.isDirty) return;

    setFields(prev => ({
      ...prev,
      [platform]: { ...prev[platform], isLoading: true }
    }));

    try {
      if (field.profileId) {
        await updateProfile(
          { 
            id: field.profileId, 
            data: { platform, username: field.value }
          }
        );
      } else {
        await createProfile({ platform, username: field.value });
      }

      toast({
        title: "Succès",
        description: "Profil mis à jour",
        status: "success"
      });

      setFields(prev => ({
        ...prev,
        [platform]: { ...prev[platform], isDirty: false, isLoading: false }
      }));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        status: "error"
      });

      setFields(prev => ({
        ...prev,
        [platform]: { ...prev[platform], isLoading: false }
      }));
    }
  };

  const renderPlatformFields = (platforms: SocialPlatform[]) => {
    return platforms.map(platform => {
      const field = fields[platform];
      const profile = profiles?.find(p => p.platform === platform);

      return (
        <Box key={platform} mb={2}>
          <HStack spacing={4} align="center">
            <Text width="100px" fontWeight="medium" fontSize="sm">{platform}</Text>
            <Input
              value={field.value}
              onChange={(e) => handleChange(platform, e.target.value)}
              placeholder={`Votre ${platform}`}
              size="sm"
              flex={1}
            />
            <HStack spacing={1}>
              {field.isDirty && (
                <>
                  <IconButton
                    aria-label="Cancel"
                    icon={<FiX />}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCancel(platform)}
                  />
                  <IconButton
                    aria-label="Save"
                    icon={<FiSave />}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleSave(platform)}
                    isLoading={field.isLoading}
                  />
                </>
              )}
              {profile?.url && !field.isDirty && (
                <IconButton
                  aria-label="Open profile"
                  icon={<FiExternalLink />}
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(profile.url || '', "_blank")}
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
      <VStack spacing={8} align="stretch">
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.500" mb={4}>PLATEFORMES DE JEU</Text>
          <Divider mb={4} />
          {renderPlatformFields(GAMING_PLATFORMS)}
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.500" mb={4}>RÉSEAUX SOCIAUX</Text>
          <Divider mb={4} />
          {renderPlatformFields(SOCIAL_PLATFORMS)}
        </Box>
      </VStack>
  );
}
