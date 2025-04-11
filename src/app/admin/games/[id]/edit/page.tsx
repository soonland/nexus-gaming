'use client'

import React from 'react'
import dayjs from '@/lib/dayjs'
import { useParams } from 'next/navigation'
import { Container, Alert, AlertIcon, Card, CardHeader, CardBody, Heading } from '@chakra-ui/react'
import { useGame, useGames } from '@/hooks/useGames'
import GameForm from '../../_components/GameForm'
import GameFormLoading from '@/components/loading/GameFormLoading'
import type { GameForm as IGameForm } from '@/types'

export default function EditGamePage() {
  const params = useParams()
  const id = params.id as string
  const { game, isLoading } = useGame(id)
  const { updateGame, isUpdating } = useGames()

  if (isLoading) {
    return (
      <Container maxW="container.md" py={8}>
        <GameFormLoading />
      </Container>
    )
  }

  if (!game) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error">
          <AlertIcon />
          Jeu non trouvé
        </Alert>
      </Container>
    )
  }

  const initialData = {
    title: game.title,
    description: game.description || '',
    releaseDate: game.releaseDate ? dayjs(game.releaseDate).format('YYYY-MM-DD') : null,
    coverImage: game.coverImage || null,
    platformIds: game.platforms.map(p => p.id),
    developerId: game.developer.id,
    publisherId: game.publisher.id,
  }

  const handleSubmit = async (data: IGameForm) => {
    await updateGame(id, data)
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card>
        <CardHeader>
          <Heading size="lg">Modifier le jeu</Heading>
        </CardHeader>
        <CardBody>
          <GameForm
            mode="edit"
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
          />
        </CardBody>
      </Card>
    </Container>
  )
}
