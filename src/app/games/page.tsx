'use client'

import {
  Container,
  Heading,
  SimpleGrid,
  Skeleton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { GameCard } from '@/components/games/GameCard'
import { useGames } from '@/hooks/useGames'

export default function GamesPage() {
  const { data, isLoading, error } = useGames({ limit: '100' })
  const games = data?.games || []

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading games
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={6}>
        Games
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {isLoading
          ? [...Array(6)].map((_, i) => <Skeleton key={i} height="300px" />)
          : games.map((game) => <GameCard key={game.id} game={game} />)}
      </SimpleGrid>
    </Container>
  )
}
