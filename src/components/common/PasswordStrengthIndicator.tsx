'use client'

import { Box, Progress, Text } from '@chakra-ui/react'

interface PasswordStrengthIndicatorProps {
  password: string
}

const getPasswordStrength = (password: string): [number, string, string] => {
  let strength = 0
  let strengthText = 'Weak'
  let colorScheme = 'red'

  if (!password) {
    return [0, strengthText, colorScheme]
  }

  // Increment strength for each criteria met
  if (password.length >= 8) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[a-z]/.test(password)) strength += 25
  if (/[0-9!@#$%^&*]/.test(password)) strength += 25

  // Determine strength text and color based on score
  if (strength >= 100) {
    strengthText = 'Very Strong'
    colorScheme = 'green'
  } else if (strength >= 75) {
    strengthText = 'Strong'
    colorScheme = 'teal'
  } else if (strength >= 50) {
    strengthText = 'Medium'
    colorScheme = 'yellow'
  }

  return [strength, strengthText, colorScheme]
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [strength, strengthText, colorScheme] = getPasswordStrength(password)

  return (
    <Box mt={2}>
      <Progress value={strength} size="sm" colorScheme={colorScheme} borderRadius="full" />
      <Text fontSize="sm" color={`${colorScheme}.500`} mt={1}>
        {strengthText}
      </Text>
    </Box>
  )
}
