'use client'

import React from 'react'
import {
  Box,
  Card,
  CardBody,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import type { Game } from '@prisma/client'

type GameWithRelations = Game & {
  platforms: { name: string }[]
  developer: { name: string }
  publisher: { name: string }
}

interface GameCardProps {
  game: GameWithRelations
}

export function GameCard({ game }: GameCardProps) {
  const bgColor = useColorModeValue('white', 'gray.800')

  if (!game) {
    console.warn('GameCard rendered without game data')
    return null
  }

  const platformsText = game.platforms?.length 
    ? game.platforms.map(p => p.name).join(', ')
    : 'Plateformes non spécifiées'

  return (
    <Card
      as={Link}
      href={`/games/${game.id}`}
      bg={bgColor}
      h="100%"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-4px)', textDecoration: 'none' }}
      overflow="hidden"
    >
        <Box position="relative" height="200px">
          <Image
            src={game.coverImage || '/images/placeholder-game.png'}
            alt={game.title}
            height={200}
            width="100%"
            objectFit="cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.src = '/images/placeholder-game.png'
            }}
          />
        </Box>
        <CardBody>
          <Stack spacing={2}>
            <Heading size="md" noOfLines={2}>
              {game.title}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {game.developer?.name || 'Développeur inconnu'}
            </Text>
            <Box>
              <Text fontSize="sm" color="gray.500">
                {platformsText}
              </Text>
            </Box>
          </Stack>
        </CardBody>
    </Card>
  )
}
