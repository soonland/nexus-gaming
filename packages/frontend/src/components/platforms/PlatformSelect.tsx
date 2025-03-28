import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
} from '@chakra-ui/react'
import { usePlatforms } from '@/hooks/usePlatforms'

interface PlatformSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export const PlatformSelect = ({ value, onChange, error }: PlatformSelectProps) => {
  const { platforms, isLoading } = usePlatforms()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value)
    onChange(selectedOptions)
  }

  return (
    <FormControl isRequired isInvalid={!!error}>
      <FormLabel>Plateformes</FormLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        size="md"
        height="120px"
        disabled={isLoading}
      >
        {platforms?.map((platform) => (
          <option key={platform.id} value={platform.id}>
            {platform.name} ({platform.manufacturer})
          </option>
        ))}
      </Select>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}
