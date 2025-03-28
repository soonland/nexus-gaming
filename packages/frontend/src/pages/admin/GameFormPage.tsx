import { Container, Heading, useToast } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { GameForm } from '@/components/games/GameForm'
import { useGames } from '@/hooks/useGames'
import { GameFormData } from '@/types/game'
import axios from 'axios'
import { Game } from '@/types/game'

const transformGameToFormData = (game: Game): GameFormData => {
  const { releaseDate, title, ...rest } = game;
  let releasePeriod = undefined;

  if (releaseDate) {
    releasePeriod = {
      type: 'date' as const,
      value: releaseDate,
    };
  }

  return {
    ...rest,
    title: title,
    releasePeriod,
    platformIds: game.platforms.map((platform) => platform.id),
  };
};

export const AdminGameFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createGame, updateGame, games, isCreating, isUpdating } = useGames()
  const foundGame = id ? games.find(g => g.id === id) : undefined
  const game: GameFormData | undefined = foundGame ? transformGameToFormData(foundGame) : undefined

  const toast = useToast()
  
  const handleSubmit = async (formData: GameFormData) => {
    try {
      const data = {
        ...formData,
      }
      
      if (id) {
        await updateGame({ id, data })
        toast({
          title: 'Jeu mis à jour',
          status: 'success',
          duration: 3000,
        })
      } else {
        await createGame(data)
        toast({
          title: 'Jeu créé',
          status: 'success',
          duration: 3000,
        })
      }
      navigate('/admin/games')
    } catch (error: unknown) {
      console.error('Form submission error:', error)
      let errorMessage = 'Une erreur est survenue lors de l\'enregistrement'
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          errorMessage = 'Vous n\'avez pas les droits nécessaires pour effectuer cette action'
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message
        }
      }
      
      toast({
        title: 'Erreur',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
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
        isSubmitting={id ? isUpdating : isCreating}
      />
    </Container>
  )
}
