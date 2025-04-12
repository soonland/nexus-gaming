'use client'

import { Box, VStack, useColorModeValue, ChakraProvider } from '@chakra-ui/react'
import { createCustomTheme, themeColorMap } from '@/theme'
import type { ThemeName } from '@/theme'

interface ThemePreviewProps {
  themeName: ThemeName
  isSelected: boolean
  onClick: () => void
}

export const ThemePreview = ({ themeName, isSelected, onClick }: ThemePreviewProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const selectedBorderColor = useColorModeValue('blue.500', 'blue.300')
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <ChakraProvider theme={createCustomTheme(themeName)}>
      <Box
        as="button"
        onClick={onClick}
        w="full"
        h="150px"
        p={2}
        border="2px solid"
        borderColor={isSelected ? selectedBorderColor : borderColor}
        borderRadius="md"
        transition="all 0.2s"
        cursor="pointer"
        _hover={{
          transform: 'scale(1.05)',
          borderColor: selectedBorderColor,
          shadow: 'md'
        }}
      >
      <VStack h="full" spacing={2}>
        {/* Header/Navigation */}
        <Box
          bg={`${themeColorMap[themeName]}.500`}
          h="20%"
          w="full"
          rounded="sm"
        />

        {/* Content Card */}
        <Box
          flex={1}
          w="full"
          bg={bgColor}
          shadow="sm"
          rounded="sm"
          p={1}
        >
          <VStack spacing={1} align="start">
            <Box
              bg={`${themeColorMap[themeName]}.100`}
              h="4px"
              w="80%"
              rounded="full"
            />
            <Box
              bg={`${themeColorMap[themeName]}.200`}
              h="4px"
              w="60%"
              rounded="full"
            />
          </VStack>
        </Box>

        {/* Action Button */}
        <Box
          bg={`${themeColorMap[themeName]}.500`}
          h="15%"
          w="70%"
          rounded="sm"
        />
      </VStack>
    </Box>
    </ChakraProvider>
  )
}
