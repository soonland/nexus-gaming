'use client'

import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiBell } from 'react-icons/fi'
import Link from 'next/link'
import { usePasswordExpiration } from '@/hooks/usePasswordExpiration'

export function NotificationBell() {
  const passwordExpiration = usePasswordExpiration()
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const hasNotifications = passwordExpiration?.isExpiringSoon || passwordExpiration?.isExpired

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Box position="relative">
          <IconButton
            aria-label="Notifications"
            icon={<FiBell size={20} />}
            variant="ghost"
            position="relative"
          />
          {hasNotifications && (
            <Box
              position="absolute"
              top="-1"
              right="-1"
              w="3"
              h="3"
              bg="red.500"
              borderRadius="full"
              border="2px solid white"
            />
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent width="300px">
        <PopoverBody py={4}>
          {hasNotifications ? (
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontWeight="medium" fontSize="sm">
                  {passwordExpiration?.isExpired
                    ? 'Votre mot de passe a expiré'
                    : `Votre mot de passe expire dans ${passwordExpiration?.daysUntilExpiration} jours`
                  }
                </Text>
                <Text fontSize="sm" color={textColor}>
                  Pour votre sécurité, veuillez mettre à jour votre mot de passe.
                </Text>
              </Box>
              <Button
                as={Link}
                href="/profile"
                size="sm"
                colorScheme={passwordExpiration?.isExpired ? 'red' : 'blue'}
              >
                Changer le mot de passe
              </Button>
            </VStack>
          ) : (
            <Text color="gray.500" fontSize="sm">
              Aucune notification
            </Text>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
