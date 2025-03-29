import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { GameSelector } from '../games/GameSelector'
import { CategorySelect } from '../categories/CategorySelect'

interface ArticleFormProps {
  initialData?: {
    title: string
    content: string
    gameIds: string[]
    categoryId?: string
  }
  onSubmit: (data: {
    title: string
    content: string
    gameIds: string[]
    categoryId?: string
  }) => Promise<void>
  showSuccessMessage?: boolean
}

export const ArticleForm = ({ 
  initialData, 
  onSubmit,
  showSuccessMessage = false 
}: ArticleFormProps) => {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [selectedGames, setSelectedGames] = useState<string[]>(
    initialData?.gameIds ?? []
  )
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialData?.categoryId || null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({
        title,
        content,
        gameIds: selectedGames,
        categoryId: selectedCategory || undefined,
      })
      if (showSuccessMessage) {
        toast({
          title: 'Succès',
          description: 'Article enregistré avec succès',
          status: 'success',
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        status: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGameSelection = (gameIds: string[]) => {
    setSelectedGames(gameIds)
  }

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Titre</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'article"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Contenu</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Contenu de l'article"
            minHeight="200px"
          />
        </FormControl>

        <CategorySelect
          value={selectedCategory || undefined}
          onChange={setSelectedCategory}
        />

        <FormControl>
          <FormLabel>Jeux associés</FormLabel>
          <GameSelector
            selectedGames={selectedGames}
            onChange={handleGameSelection}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          loadingText="Enregistrement..."
        >
          Enregistrer
        </Button>
      </VStack>
    </Box>
  )
}
