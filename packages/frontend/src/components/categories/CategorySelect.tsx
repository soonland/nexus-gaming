import { useEffect, useState } from 'react'
import {
  FormControl,
  FormLabel,
  Select,
  Spinner,
  useToast,
} from '@chakra-ui/react'
import { Category } from '../../types/category'
import { getCategories } from '../../services/api/categories'

interface CategorySelectProps {
  value?: string
  onChange: (categoryId: string | null) => void
  isRequired?: boolean
}

export const CategorySelect = ({
  value,
  onChange,
  isRequired = false,
}: CategorySelectProps) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les catégories',
          status: 'error',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [toast])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <FormControl isRequired={isRequired}>
      <FormLabel>Catégorie</FormLabel>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        placeholder="Sélectionner une catégorie"
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}
