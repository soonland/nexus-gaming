'use client';

import {
  Box,
  Container,
  Heading,
  Stack,
  HStack,
  Badge,
  Image,
} from '@chakra-ui/react';
import type React from 'react';

interface IHeroProps {
  title: string;
  image?: string;
  badges?: Array<{
    id: string;
    label: string;
    colorScheme?: string;
  }>;
  metadata?: React.ReactNode;
  height?: { base: string; md: string };
}

export const Hero = ({
  title,
  image,
  badges = [],
  metadata,
  height = { base: '300px', md: '400px' },
}: IHeroProps) => {
  return (
    <Box height={height} mb={8} overflow='hidden' position='relative'>
      <Box
        bgGradient='linear(to-t, blackAlpha.800, blackAlpha.400)'
        bottom={0}
        left={0}
        position='absolute'
        right={0}
        top={0}
        zIndex={1}
      />
      <Image
        alt={title}
        height='100%'
        objectFit='cover'
        src={image || 'images/placeholder-game.png'}
        width='100%'
      />
      <Container
        height='100%'
        maxW='container.xl'
        position='relative'
        zIndex={2}
      >
        <Stack
          bottom={8}
          color='white'
          left={0}
          position='absolute'
          right={0}
          spacing={4}
        >
          {badges.length > 0 && (
            <HStack spacing={2} wrap='wrap'>
              {badges.map(badge => (
                <Badge key={badge.id} colorScheme={badge.colorScheme || 'blue'}>
                  {badge.label}
                </Badge>
              ))}
            </HStack>
          )}
          <Heading size='2xl'>{title}</Heading>
          {metadata && <Box>{metadata}</Box>}
        </Stack>
      </Container>
    </Box>
  );
};
