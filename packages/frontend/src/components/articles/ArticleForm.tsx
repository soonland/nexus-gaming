import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Select,
  useToast,
} from '@chakra-ui/react'
import { useGames } from '../../hooks/useGames'
import { Game } from '../../types/game'

interface ArticleFormProps {
  initialData?: {
    title: string
    content: string
    gameIds: string[]
  }
  onSubmit: (data: {
    title: string
    content: string
    gameIds: string[]
  }) => Promise<void>
}

export const ArticleForm = ({ initialData, onSubmit }: ArticleFormProps) => {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [selectedGames, setSelectedGames] = useState<string[]>(
    initialData?.gameIds ?? []
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { games } = useGames()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({
        title,
        content,
        gameIds: selectedGames,
      })
      toast({
        title: 'Succès',
        description: 'Article enregistré avec succès',
        status: 'success',
      })
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

  const handleGameSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    )
    setSelectedGames(selectedOptions)
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

        <FormControl>
          <FormLabel>Jeux associés</FormLabel>
          <Select
            multiple
            height="200px"
            value={selectedGames}
            onChange={handleGameSelection}
          >
            {games?.map((game: Game) => (
              <option key={game.id} value={game.id}>
                {game.title}
              </option>
            ))}
          </Select>
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
