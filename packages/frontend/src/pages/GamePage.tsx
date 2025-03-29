import { Box, Container } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { GameDetail } from "../components/games/GameDetail"
import { GameWithDetails } from "../types/game"
import { getGame } from "../services/api/games"

export const GamePage = () => {
  const { id } = useParams()
  const [game, setGame] = useState<GameWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) return
      try {
        const response = await getGame(id)
        setGame(response.data)
      } catch (error) {
        console.error('Error fetching game:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGame()
  }, [id])

  if (loading) {
    return <Box p={8}>Chargement...</Box>
  }

  if (!game) {
    return <Box p={8}>Jeu non trouvé</Box>
  }

  return (
    <Container maxW="container.xl" py={8}>
      <GameDetail game={game} />
    </Container>
  )
}
