import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { Category } from '../../types/category'

interface CategoryFormProps {
  initialData?: Category
  onSubmit: (data: { name: string }) => Promise<void>
}

export const CategoryForm = ({ initialData, onSubmit }: CategoryFormProps) => {
  const [name, setName] = useState(initialData?.name ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({ name })
      toast({
        title: 'Succès',
        description: 'Catégorie enregistrée avec succès',
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

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Nom</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la catégorie"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          loadingText="Enregistrement..."
        >
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </VStack>
    </Box>
  )
}
