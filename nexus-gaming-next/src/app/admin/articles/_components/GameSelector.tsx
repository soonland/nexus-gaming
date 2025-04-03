import React, { useCallback } from 'react'
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Grid,
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Checkbox,
  HStack,
  Skeleton,
} from '@chakra-ui/react'
import { useGames } from '@/hooks/useGames'
import { GameWithRelations } from '@/types/game'

interface GameSelectorProps {
  selectedIds: string[]
  onChange: (ids: string[]) => void
  error?: string
}

export default function GameSelector({
  selectedIds,
  onChange,
  error,
}: GameSelectorProps) {
  const { games, isLoading } = useGames()

  const handleGameToggle = useCallback(
    (gameId: string) => {
      const newSelectedIds = selectedIds.includes(gameId)
        ? selectedIds.filter((id) => id !== gameId)
        : [...selectedIds, gameId]
      onChange(newSelectedIds)
    },
    [selectedIds, onChange]
  )

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>Jeux associés</FormLabel>
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
        gap={4}
      >
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <Skeleton key={i} height="100px" borderRadius="lg" />
            ))
          : games?.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isSelected={selectedIds.includes(game.id)}
                onToggle={handleGameToggle}
              />
            ))}
      </Grid>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

interface GameCardProps {
  game: GameWithRelations
  isSelected: boolean
  onToggle: (id: string) => void
}

function GameCard({ game, isSelected, onToggle }: GameCardProps) {
  return (
    <Card
      variant="outline"
      cursor="pointer"
      onClick={() => onToggle(game.id)}
      borderColor={isSelected ? 'blue.500' : undefined}
      _hover={{ borderColor: 'blue.500' }}
      transition="all 0.2s"
    >
      <CardBody p={4}>
        <HStack spacing={4}>
          <Box flexShrink={0} width="60px" height="60px" position="relative">
            <Image
              src={game.coverImage || '/images/placeholder-game.png'}
              alt={game.title}
              width="100%"
              height="100%"
              objectFit="cover"
              borderRadius="md"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.src = '/images/placeholder-game.png'
              }}
            />
          </Box>
          <Stack spacing={1} flex={1}>
            <Heading size="sm" noOfLines={1}>
              {game.title}
            </Heading>
            <Text fontSize="sm" color="gray.600">
              {game.developer.name}
            </Text>
          </Stack>
          <Checkbox
            isChecked={isSelected}
            colorScheme="blue"
            onChange={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </HStack>
      </CardBody>
    </Card>
  )
}
