import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  HStack,
} from '@chakra-ui/react'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { deleteArticle, getArticles } from '../../services/api/articles'
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons'

interface Article {
  id: string
  title: string
  content: string
  publishedAt: string
  user: {
    username: string
  }
  games: {
    game: {
      title: string
    }
  }[]
}

export const ArticleListPage = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const navigate = useNavigate()
  const toast = useToast()

  const fetchArticles = async () => {
    try {
      const response = await getArticles()
      setArticles(response.data)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les articles',
        status: 'error',
      })
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id)
      toast({
        title: 'Succès',
        description: 'Article supprimé',
        status: 'success',
      })
      await fetchArticles()
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'article',
        status: 'error',
      })
    }
  }

  return (
    <AdminGuard>
      <Container maxW="container.xl" py={8}>
        <HStack justify="space-between" mb={8}>
          <Heading size="lg">Articles</Heading>
          <Button
            colorScheme="green"
            leftIcon={<AddIcon />}
            onClick={() => navigate('/admin/articles/new')}
          >
            Nouvel article
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Titre</Th>
                <Th>Auteur</Th>
                <Th>Date de publication</Th>
                <Th>Jeux associés</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {articles.map((article) => (
                <Tr key={article.id}>
                  <Td>{article.title}</Td>
                  <Td>{article.user.username}</Td>
                  <Td>
                    {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                  </Td>
                  <Td>
                    {article.games
                      .map((game) => game.game.title)
                      .join(', ')}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Modifier"
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
                      />
                      <IconButton
                        aria-label="Supprimer"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(article.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Container>
    </AdminGuard>
  )
}
