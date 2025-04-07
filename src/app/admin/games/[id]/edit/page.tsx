'use client'

import React from 'react'
import dayjs from '@/lib/dayjs'
import { useParams } from 'next/navigation'
import { Container, Alert, AlertIcon } from '@chakra-ui/react'
import { useGame, useGames } from '@/hooks/useGames'
import GameForm from '../../_components/GameForm'
import GameFormLoading from '@/components/loading/GameFormLoading'
import type { GameForm as IGameForm } from '@/types'

export default function EditGamePage() {
  const params = useParams()
  const id = params.id as string
  const { game, isLoading } = useGame(id)
  const { updateGame, isUpdating } = useGames()

  if (isLoading || !game) {
    return <GameFormLoading />
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
    <GameForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isUpdating}
    />
  )
}
