import { Container, Heading } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { GameForm } from '@/components/games/GameForm'
import { useGames } from '@/hooks/useGames'
import { GameFormData } from '@/types/game'

export const AdminGameFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createGame, updateGame, games } = useGames()
  const game = id ? games.find(g => g.id === id) : undefined

  const handleSubmit = async (data: GameFormData) => {
    if (id) {
      await updateGame({ id, data })
    } else {
      await createGame(data)
    }
    navigate('/admin/games')
  }

  const handleCancel = () => {
    navigate('/admin/games')
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg" mb={6}>
        {id ? 'Modifier un jeu' : 'Créer un jeu'}
      </Heading>
      <GameForm
        initialData={game}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Container>
  )
}
