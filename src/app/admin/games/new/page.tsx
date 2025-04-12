'use client'

import { Container, Card, CardHeader, CardBody, Heading } from '@chakra-ui/react'
import { useGames } from '@/hooks/useGames'
import GameForm from '../_components/GameForm'

export default function NewGamePage() {
  const { createGame, isCreating } = useGames()

  return (
    <Container maxW="container.md" py={8}>
      <Card>
        <CardHeader>
          <Heading size="lg">Nouveau jeu</Heading>
        </CardHeader>
        <CardBody>
          <GameForm
            mode="create"
            onSubmit={createGame}
            isLoading={isCreating}
          />
        </CardBody>
      </Card>
    </Container>
  )
}
