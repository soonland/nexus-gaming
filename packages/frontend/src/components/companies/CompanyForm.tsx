import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { FormEvent, useState } from 'react'
import { Company, CompanyFormData } from '../../types/company'

interface CompanyFormProps {
  initialData?: Company
  onSubmit: (data: CompanyFormData) => Promise<void>
}

export const CompanyForm = ({ initialData, onSubmit }: CompanyFormProps) => {
  const [name, setName] = useState(initialData?.name || '')
  const [isDeveloper, setIsDeveloper] = useState(initialData?.isDeveloper || false)
  const [isPublisher, setIsPublisher] = useState(initialData?.isPublisher || false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!name) {
      toast({
        title: 'Erreur',
        description: 'Le nom est requis',
        status: 'error',
      })
      return
    }

    if (!isDeveloper && !isPublisher) {
      toast({
        title: 'Erreur',
        description: 'La société doit être développeur et/ou éditeur',
        status: 'error',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        name,
        isDeveloper,
        isPublisher,
      })
      toast({
        title: 'Succès',
        description: `Société ${initialData ? 'modifiée' : 'créée'} avec succès`,
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
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Nom</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la société"
          />
        </FormControl>

        <FormControl>
          <Stack spacing={2}>
            <Checkbox
              isChecked={isDeveloper}
              onChange={(e) => setIsDeveloper(e.target.checked)}
            >
              Développeur
            </Checkbox>
            <Checkbox
              isChecked={isPublisher}
              onChange={(e) => setIsPublisher(e.target.checked)}
            >
              Éditeur
            </Checkbox>
          </Stack>
        </FormControl>

        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          {initialData ? 'Modifier' : 'Créer'}
        </Button>
      </Stack>
    </form>
  )
}
