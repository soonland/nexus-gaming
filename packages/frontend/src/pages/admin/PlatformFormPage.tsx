import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePlatforms, usePlatformDetails } from '@/hooks/usePlatforms'
import { PlatformFormData } from '@/types/platform'

export const AdminPlatformFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { createPlatform, updatePlatform, isCreating, isUpdating } = usePlatforms()
  const { platform, isLoading: isLoadingPlatform } = usePlatformDetails(id || '')

  const [formData, setFormData] = useState<PlatformFormData>({
    name: '',
    manufacturer: '',
    releaseDate: null,
  })

  useEffect(() => {
    if (platform) {
      setFormData({
        name: platform.name,
        manufacturer: platform.manufacturer,
        releaseDate: platform.releaseDate,
      })
    }
  }, [platform])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (id) {
        await updatePlatform({ id, data: formData })
        toast({
          title: 'Plateforme mise à jour',
          status: 'success',
          duration: 3000,
        })
      } else {
        await createPlatform(formData)
        toast({
          title: 'Plateforme créée',
          status: 'success',
          duration: 3000,
        })
      }
      navigate('/admin/platforms')
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        status: 'error',
        duration: 5000,
      })
    }
  }

  if (id && isLoadingPlatform) {
    return <div>Chargement...</div>
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">
          {id ? 'Modifier la plateforme' : 'Nouvelle plateforme'}
        </Heading>

        <Box as="form" onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nom</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ex: PlayStation 5"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Fabricant</FormLabel>
              <Input
                value={formData.manufacturer}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    manufacturer: e.target.value,
                  }))
                }
                placeholder="Ex: Sony"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Date de sortie</FormLabel>
              <Input
                type="date"
                value={formData.releaseDate?.split('T')[0] || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    releaseDate: e.target.value || null,
                  }))
                }
              />
            </FormControl>

            <Stack direction="row" spacing={4} justifyContent="flex-end">
              <Button
                onClick={() => navigate('/admin/platforms')}
                variant="ghost"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isCreating || isUpdating}
              >
                {id ? 'Mettre à jour' : 'Créer'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </VStack>
    </Container>
  )
}
