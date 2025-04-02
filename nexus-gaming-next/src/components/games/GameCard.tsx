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
  Badge,
  HStack,
  Icon,
  Wrap,
  WrapItem,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react'
import { BsCalendar4 } from 'react-icons/bs'
import Link from 'next/link'
import { DateDisplay } from '@/components/common/DateDisplay'
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
  const dateColor = useColorModeValue('blue.600', 'blue.300')
  const overlayGradient = useColorModeValue(
    'linear(to-t, blackAlpha.600, blackAlpha.300)',
    'linear(to-t, blackAlpha.700, blackAlpha.400)'
  )

  if (!game) {
    console.warn('GameCard rendered without game data')
    return null
  }

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
      {/* Image avec overlay */}
      <Box position="relative" height="200px" overflow="hidden">
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient={overlayGradient}
          zIndex={1}
        />
        <Image
          src={game.coverImage || '/images/placeholder-game.png'}
          alt={game.title}
          height="100%"
          width="100%"
          objectFit="cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement
            img.src = '/images/placeholder-game.png'
          }}
        />
      </Box>

      <CardBody>
        <Stack spacing={4}>
          {/* Titre et description */}
          <Stack spacing={2}>
            <Heading size="md" noOfLines={2}>
              {game.title}
            </Heading>
            <Text fontSize="sm" color="gray.600" noOfLines={3}>
              {game.description}
            </Text>
          </Stack>

          {/* Date de sortie */}
          {game.releaseDate && (
            <HStack color={dateColor}>
              <Icon as={BsCalendar4} />
              <DateDisplay 
                date={game.releaseDate}
                format="calendar"
                tooltipFormat="long"
                color={dateColor}
              />
            </HStack>
          )}

          {/* Plateformes */}
          {game.platforms.length > 0 && (
            <>
              <Divider />
              <Wrap spacing={2}>
                {game.platforms.map((platform) => (
                  <WrapItem key={platform.name}>
                    <Badge
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      colorScheme="blue"
                      variant="subtle"
                      _hover={{
                        bg: 'blue.100',
                        transform: 'scale(1.05)',
                      }}
                      transition="all 0.2s"
                    >
                      {platform.name}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            </>
          )}
        </Stack>
      </CardBody>
    </Card>
  )
}
