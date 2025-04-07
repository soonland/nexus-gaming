'use client'

import React from 'react'
import {
  Box,
  Container,
  Heading,
  Stack,
  HStack,
  Badge,
  Image,
} from '@chakra-ui/react'

interface HeroProps {
  title: string
  image?: string
  badges?: Array<{
    id: string
    label: string
    colorScheme?: string
  }>
  metadata?: React.ReactNode
  height?: { base: string; md: string }
}

export function Hero({ 
  title, 
  image, 
  badges = [], 
  metadata,
  height = { base: '300px', md: '400px' }
}: HeroProps) {
  return (
    <Box
      position="relative"
      height={height}
      overflow="hidden"
      mb={8}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(to-t, blackAlpha.800, blackAlpha.400)"
        zIndex={1}
      />
      <Image
        src={image || 'images/placeholder-game.png'}
        alt={title}
        width="100%"
        height="100%"
        objectFit="cover"
      />
      <Container maxW="container.xl" position="relative" zIndex={2} height="100%">
        <Stack
          spacing={4}
          position="absolute"
          bottom={8}
          left={0}
          right={0}
          color="white"
        >
          {badges.length > 0 && (
            <HStack wrap="wrap" spacing={2}>
              {badges.map((badge) => (
                <Badge 
                  key={badge.id} 
                  colorScheme={badge.colorScheme || 'blue'}
                >
                  {badge.label}
                </Badge>
              ))}
            </HStack>
          )}
          <Heading size="2xl">{title}</Heading>
          {metadata && (
            <Box>{metadata}</Box>
          )}
        </Stack>
      </Container>
    </Box>
  )
}
