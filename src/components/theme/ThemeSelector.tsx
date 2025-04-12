'use client';

import { SimpleGrid, Text, VStack } from '@chakra-ui/react';

import type { ThemeName } from '@/theme';

import { ThemePreview } from './ThemePreview';

const themeLabels: Record<ThemeName, string> = {
  default: 'Par défaut (Bleu)',
  gaming: 'Gaming (Violet)',
  nature: 'Nature (Vert)',
  retro: 'Retro (Orange)',
};

interface IThemeSelectorProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export const ThemeSelector = ({
  currentTheme,
  onThemeChange,
}: IThemeSelectorProps) => {
  const themes: ThemeName[] = ['default', 'gaming', 'nature', 'retro'];

  return (
    <SimpleGrid columns={2} px={4} spacing={6} w='full'>
      {themes.map(themeName => (
        <VStack key={themeName} align='center' spacing={3} w='full'>
          <ThemePreview
            isSelected={currentTheme === themeName}
            themeName={themeName}
            onClick={() => onThemeChange(themeName)}
          />
          <Text fontSize='sm'>{themeLabels[themeName]}</Text>
        </VStack>
      ))}
    </SimpleGrid>
  );
};
