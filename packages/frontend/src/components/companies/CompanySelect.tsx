import {
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Company } from '../../types/company'
import { getDevelopers, getPublishers } from '../../services/api/companies'

interface CompanySelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  type: 'developer' | 'publisher'
  isRequired?: boolean
  error?: string
}

export const CompanySelect = ({
  label,
  value,
  onChange,
  type,
  isRequired = false,
  error,
}: CompanySelectProps) => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await (type === 'developer' ? getDevelopers() : getPublishers())
        setCompanies(data)
      } catch (error) {
        console.error(`Error fetching ${type}s:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanies()
  }, [type])

  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Sélectionner un ${type === 'developer' ? 'développeur' : 'éditeur'}`}
        isDisabled={isLoading}
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </Select>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}
