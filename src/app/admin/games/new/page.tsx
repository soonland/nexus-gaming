'use client'

import React from 'react'
import { useGames } from '@/hooks/useGames'
import GameForm from '../_components/GameForm'
import GameFormLoading from '@/components/loading/GameFormLoading'

export default function NewGamePage() {
  const { createGame, isCreating } = useGames()

  return (
    <GameForm
      mode="create"
      onSubmit={createGame}
      isLoading={isCreating}
    />
  )
}
