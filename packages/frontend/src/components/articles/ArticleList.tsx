import { Card, CardBody, Grid, Heading, Image, Stack, Text, LinkBox, LinkOverlay } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getArticles } from '../../services/api/articles'
import { Link as RouterLink } from 'react-router-dom'

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

export const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await getArticles()
      setArticles(response.data)
    }
    fetchArticles()
  }, [])

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
      {articles.map((article) => (
        <LinkBox 
          as={Card} 
          key={article.id} 
          maxW="md" 
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
        >
          <CardBody>
            {article.games[0]?.game.coverImage && (
              <Image
                src={article.games[0].game.coverImage}
                alt={article.games[0].game.title}
                borderRadius="lg"
                mb={4}
              />
            )}
            <Stack mt="2" spacing="3">
              <LinkOverlay as={RouterLink} to={`/articles/${article.id}`}>
                <Heading size="md">{article.title}</Heading>
              </LinkOverlay>
              <Text color="gray.500" fontSize="sm">
                Par {article.user.username} • {new Date(article.publishedAt).toLocaleDateString()}
              </Text>
              <Text noOfLines={3}>
                {article.content}
              </Text>
              {article.games.length > 0 && (
                <Text fontSize="sm" color="gray.500">
                  Jeux: {article.games.map(g => g.game.title).join(', ')}
                </Text>
              )}
            </Stack>
          </CardBody>
        </LinkBox>
      ))}
    </Grid>
  )
}
