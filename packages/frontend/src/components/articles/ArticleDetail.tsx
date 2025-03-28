import { Box, Container, Heading, Text, Image, VStack, HStack, Link } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { getArticle } from '../../services/api/articles'

interface Article {
  id: string
  title: string
  content: string
  publishedAt: string
  user: {
    id: string
    username: string
  }
  games: {
    game: {
      id: string
      title: string
      coverImage?: string
    }
  }[]
}

export const ArticleDetail = () => {
  const { id } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return
      try {
        const response = await getArticle(id)
        setArticle(response.data)
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  if (loading) {
    return <Box p={8}>Chargement...</Box>
  }

  if (!article) {
    return <Box p={8}>Article non trouvé</Box>
  }

  return (
    <Container maxW="container.lg" py={8}>
      {article.games[0]?.game.coverImage && (
        <Box mb={8}>
          <Image
            src={article.games[0].game.coverImage}
            alt={article.games[0].game.title}
            borderRadius="lg"
            w="100%"
            maxH="400px"
            objectFit="cover"
          />
        </Box>
      )}

      <VStack align="stretch" spacing={6}>
        <Heading size="2xl">{article.title}</Heading>
        
        <HStack spacing={4} color="gray.500">
          <Text>Par {article.user.username}</Text>
          <Text>•</Text>
          <Text>{new Date(article.publishedAt).toLocaleDateString()}</Text>
        </HStack>

        {article.games.length > 0 && (
          <Box>
            <Text fontWeight="bold" mb={2}>Jeux mentionnés:</Text>
            <HStack spacing={2}>
              {article.games.map((gameRef) => (
                <Link
                  key={gameRef.game.id}
                  as={RouterLink}
                  to={`/games/${gameRef.game.id}`}
                  color="blue.500"
                >
                  {gameRef.game.title}
                </Link>
              ))}
            </HStack>
          </Box>
        )}

        <Box
          whiteSpace="pre-wrap"
          sx={{
            'p': {
              marginBottom: 4
            }
          }}
        >
          {article.content}
        </Box>
      </VStack>
    </Container>
  )
}
