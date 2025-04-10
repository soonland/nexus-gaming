'use client'

import React from 'react'
import { SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { ThemePreview } from './ThemePreview'
import type { ThemeName } from '@/theme'

const themeLabels: Record<ThemeName, string> = {
  default: 'Par défaut (Bleu)',
  gaming: 'Gaming (Violet)',
  nature: 'Nature (Vert)',
  retro: 'Retro (Orange)'
}

interface ThemeSelectorProps {
  currentTheme: ThemeName
  onThemeChange: (theme: ThemeName) => void
}

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const themes: ThemeName[] = ['default', 'gaming', 'nature', 'retro']

  return (
    <SimpleGrid columns={2} spacing={6} w="full" px={4}>
      {themes.map((themeName) => (
        <VStack key={themeName} spacing={3} align="center" w="full">
          <ThemePreview
            themeName={themeName}
            isSelected={currentTheme === themeName}
            onClick={() => onThemeChange(themeName)}
          />
          <Text fontSize="sm">{themeLabels[themeName]}</Text>
        </VStack>
      ))}
    </SimpleGrid>
  )
}
