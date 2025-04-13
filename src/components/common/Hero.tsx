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
    <Box mb={8}>
      <Container maxW='container.xl'>
        <Box height={height} overflow='hidden' position='relative' rounded='lg'>
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
          <Stack
            bottom={8}
            color='white'
            left={8}
            position='absolute'
            right={8}
            spacing={4}
            zIndex={2}
          >
            {badges.length > 0 && (
              <HStack spacing={2} wrap='wrap'>
                {badges.map(badge => (
                  <Badge
                    key={badge.id}
                    colorScheme={badge.colorScheme || 'blue'}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </HStack>
            )}
            <Heading size='2xl'>{title}</Heading>
            {metadata && <Box>{metadata}</Box>}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
