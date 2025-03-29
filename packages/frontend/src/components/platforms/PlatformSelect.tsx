import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Checkbox,
  CheckboxGroup,
  Box,
  Wrap,
  WrapItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { usePlatforms } from '@/hooks/usePlatforms'

interface PlatformSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export const PlatformSelect = ({ value, onChange, error }: PlatformSelectProps) => {
  const { platforms, isLoading } = usePlatforms()
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  return (
    <FormControl isRequired isInvalid={!!error}>
      <FormLabel>Plateformes</FormLabel>
      <Box 
        maxH="200px" 
        overflowY="auto" 
        borderWidth="1px" 
        borderRadius="md" 
        borderColor={borderColor}
        p={3}
      >
        <CheckboxGroup value={value} onChange={onChange}>
          <Wrap spacing={3}>
            {platforms?.map((platform) => (
              <WrapItem key={platform.id}>
                <Checkbox
                  value={platform.id}
                  isDisabled={isLoading}
                  sx={{
                    '& .chakra-checkbox__control': {
                      borderRadius: 'sm',
                    },
                    '& .chakra-checkbox__label': {
                      userSelect: 'none',
                    },
                    padding: '2px 8px',
                    borderRadius: 'md',
                    _hover: {
                      bg: hoverBg,
                    },
                  }}
                >
                  <Text as="span" fontWeight="medium">
                    {platform.name}
                  </Text>{' '}
                  <Text as="span" fontSize="sm" color="gray.500">
                    ({platform.manufacturer})
                  </Text>
                </Checkbox>
              </WrapItem>
            ))}
          </Wrap>
        </CheckboxGroup>
      </Box>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}
