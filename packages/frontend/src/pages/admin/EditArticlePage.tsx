import { Box, Container, Heading, useToast } from '@chakra-ui/react'
import { ArticleForm } from '../../components/articles/ArticleForm'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { useEffect, useState } from 'react'
import { getArticle, updateArticle } from '../../services/api/articles'

interface Article {
  title: string
  content: string
  games: {
    game: {
      id: string
    }
  }[]
}

export const EditArticlePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [article, setArticle] = useState<Article | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return
      try {
        const response = await getArticle(id)
        setArticle(response.data)
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger l\'article',
          status: 'error',
        })
        navigate('/admin/articles')
      }
    }

    fetchArticle()
  }, [id, navigate, toast])

  const handleSubmit = async (data: {
    title: string
    content: string
    gameIds: string[]
  }) => {
    if (!id) return

    try {
      await updateArticle(id, data)
      toast({
        title: 'Succès',
        description: 'Article mis à jour',
        status: 'success',
      })
      navigate('/admin/articles')
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour l\'article',
        status: 'error',
      })
    }
  }

  if (!article) return null

  return (
    <AdminGuard>
      <Container maxW="container.lg" py={8}>
        <Box mb={8}>
          <Heading size="lg" mb={6}>
            Modifier l'article
          </Heading>
          <ArticleForm
            initialData={{
              title: article.title,
              content: article.content,
              gameIds: article.games.map((g) => g.game.id),
            }}
            onSubmit={handleSubmit}
            showSuccessMessage={false}
          />
        </Box>
      </Container>
    </AdminGuard>
  )
}
