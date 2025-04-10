'use client'

import {
  Container,
  VStack,
  Heading,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorMode,
  useColorModeValue,
  Switch,
  Text,
  Stack,
  useToast,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePasswordExpiration } from '@/hooks/usePasswordExpiration'
import PasswordStrengthIndicator from '@/components/common/PasswordStrengthIndicator'
import dayjs from '@/lib/dayjs'

export default function ProfilePage() {
  const { user, refresh } = useAuth()
  const { colorMode, toggleColorMode } = useColorMode()
  const toast = useToast()
  const passwordExpiration = usePasswordExpiration()
  const [isLoading, setIsLoading] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      setError('Les nouveaux mots de passe ne correspondent pas')
      return
    }
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password')
      }

      toast({
        title: 'Mot de passe mis à jour',
        description: 'Votre mot de passe a été changé avec succès',
        status: 'success',
        duration: 3000,
      })
      
      setPasswords({ current: '', new: '', confirm: '' })
      setError('')
      
      // Refresh auth data to update expiration info
      await refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Impossible de mettre à jour le mot de passe'
      toast({
        title: 'Erreur',
        description: message,
        status: 'error',
        duration: 5000,
      })
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Mon profil</Heading>

        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {/* Avertissement d'expiration du mot de passe */}
              {passwordExpiration && (passwordExpiration.isExpired || passwordExpiration.isExpiringSoon) && (
                <Alert
                  status={passwordExpiration.isExpired ? 'error' : 'warning'}
                  variant="left-accent"
                >
                  <AlertIcon />
                  <Box>
                    <AlertTitle>
                      {passwordExpiration.isExpired
                        ? 'Mot de passe expiré!'
                        : 'Expiration imminente!'
                      }
                    </AlertTitle>
                    <AlertDescription>
                      <VStack align="stretch" spacing={1}>
                        <Text color={textColor}>
                          {passwordExpiration.isExpired
                            ? 'Votre mot de passe a expiré. Veuillez le changer immédiatement.'
                            : `Votre mot de passe expirera dans ${passwordExpiration.daysUntilExpiration} jours. Changez-le dès maintenant pour éviter toute interruption.`
                          }
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                          Dernier changement: {dayjs(passwordExpiration.lastPasswordChange).format('DD/MM/YYYY')}
                          <br />
                          Expire le: {dayjs(passwordExpiration.expirationDate).format('DD/MM/YYYY')}
                        </Text>
                      </VStack>
                    </AlertDescription>
                  </Box>
                </Alert>
              )}

              <FormControl>
                <FormLabel>Nom d&apos;utilisateur</FormLabel>
                <Input value={user.username} isReadOnly />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input value={user.email} isReadOnly />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Préférences</Heading>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>
                  Thème {colorMode === 'dark' ? 'sombre' : 'clair'}
                </FormLabel>
                <Switch
                  isChecked={colorMode === 'dark'}
                  onChange={toggleColorMode}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <form onSubmit={handlePasswordChange}>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Changer le mot de passe</Heading>

                <FormControl>
                  <FormLabel>Mot de passe actuel</FormLabel>
                  <Input
                    type="password"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        current: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <Input
                    type="password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        new: e.target.value,
                      }))
                    }
                  />
                  {passwords.new && (
                    <PasswordStrengthIndicator password={passwords.new} />
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                  <Input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        confirm: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                {error && (
                  <Text color="red.500" fontSize="sm">
                    {error}
                  </Text>
                )}

                <Stack direction="row" justify="flex-end">
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                  >
                    Mettre à jour le mot de passe
                  </Button>
                </Stack>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
}
