'use client';

import {
  Box,
  VStack,
  useColorModeValue,
  ChakraProvider,
} from '@chakra-ui/react';

import { createCustomTheme, themeColorMap } from '@/theme';
import type { ThemeName } from '@/theme';

interface IThemePreviewProps {
  themeName: ThemeName;
  isSelected: boolean;
  onClick: () => void;
}

export const ThemePreview = ({
  themeName,
  isSelected,
  onClick,
}: IThemePreviewProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const selectedBorderColor = useColorModeValue('blue.500', 'blue.300');
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <ChakraProvider theme={createCustomTheme(themeName)}>
      <Box
        _hover={{
          transform: 'scale(1.05)',
          borderColor: selectedBorderColor,
          shadow: 'md',
        }}
        as='button'
        border='2px solid'
        borderColor={isSelected ? selectedBorderColor : borderColor}
        borderRadius='md'
        cursor='pointer'
        h='150px'
        p={2}
        transition='all 0.2s'
        w='full'
        onClick={onClick}
      >
        <VStack h='full' spacing={2}>
          {/* Header/Navigation */}
          <Box
            bg={`${themeColorMap[themeName]}.500`}
            h='20%'
            rounded='sm'
            w='full'
          />

          {/* Content Card */}
          <Box bg={bgColor} flex={1} p={1} rounded='sm' shadow='sm' w='full'>
            <VStack align='start' spacing={1}>
              <Box
                bg={`${themeColorMap[themeName]}.100`}
                h='4px'
                rounded='full'
                w='80%'
              />
              <Box
                bg={`${themeColorMap[themeName]}.200`}
                h='4px'
                rounded='full'
                w='60%'
              />
            </VStack>
          </Box>

          {/* Action Button */}
          <Box
            bg={`${themeColorMap[themeName]}.500`}
            h='15%'
            rounded='sm'
            w='70%'
          />
        </VStack>
      </Box>
    </ChakraProvider>
  );
};
