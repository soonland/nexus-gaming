import { Box, Container, Heading, useToast } from '@chakra-ui/react'
import { ArticleForm } from '../../components/articles/ArticleForm'
import { useNavigate } from 'react-router-dom'
import { createArticle } from '../../services/api/articles'
import { AdminGuard } from '../../components/admin/AdminGuard'

export const ArticleFormPage = () => {
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (data: {
    title: string
    content: string
    gameIds: string[]
  }) => {
    await createArticle(data)
    toast({
      title: 'Succès',
      description: 'Article créé avec succès',
      status: 'success',
    })
    navigate('/admin/articles')
  }

  return (
    <AdminGuard>
      <Container maxW="container.lg" py={8}>
        <Box mb={8}>
          <Heading size="lg" mb={6}>
            Créer un article
          </Heading>
          <ArticleForm onSubmit={handleSubmit} />
        </Box>
      </Container>
    </AdminGuard>
  )
}
