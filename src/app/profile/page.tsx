'use client';

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
} from '@chakra-ui/react';
import { useState } from 'react';

import PasswordStrengthIndicator from '@/components/common/PasswordStrengthIndicator';
import { SocialProfilesSection } from '@/components/profile/SocialProfilesSection';
import { ThemeSelector } from '@/components/theme/ThemeSelector';
import { useAuth } from '@/hooks/useAuth';
import { usePasswordExpiration } from '@/hooks/usePasswordExpiration';
import dayjs from '@/lib/dayjs';
import { useTheme } from '@/providers/ThemeProvider';

const ProfilePage = () => {
  const { user, refresh } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const { theme, changeTheme } = useTheme();
  const toast = useToast();
  const passwordExpiration = usePasswordExpiration();
  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      toast({
        title: 'Mot de passe mis à jour',
        description: 'Votre mot de passe a été changé avec succès',
        status: 'success',
        duration: 3000,
      });

      setPasswords({ current: '', new: '', confirm: '' });
      setError('');

      // Refresh auth data to update expiration info
      await refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Impossible de mettre à jour le mot de passe';
      toast({
        title: 'Erreur',
        description: message,
        status: 'error',
        duration: 5000,
      });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxW='container.md' py={8}>
      <VStack align='stretch' spacing={8}>
        <Heading size='lg'>Mon profil</Heading>

        <Card>
          <CardBody>
            <VStack align='stretch' spacing={4}>
              {/* Avertissement d'expiration du mot de passe */}
              {passwordExpiration &&
                (passwordExpiration.isExpired ||
                  passwordExpiration.isExpiringSoon) && (
                  <Alert
                    status={passwordExpiration.isExpired ? 'error' : 'warning'}
                    variant='left-accent'
                  >
                    <AlertIcon />
                    <Box>
                      <AlertTitle>
                        {passwordExpiration.isExpired
                          ? 'Mot de passe expiré!'
                          : 'Expiration imminente!'}
                      </AlertTitle>
                      <AlertDescription>
                        <VStack align='stretch' spacing={1}>
                          <Text color={textColor}>
                            {passwordExpiration.isExpired
                              ? 'Votre mot de passe a expiré. Veuillez le changer immédiatement.'
                              : `Votre mot de passe expirera dans ${passwordExpiration.daysUntilExpiration} jours. Changez-le dès maintenant pour éviter toute interruption.`}
                          </Text>
                          <Text color={textColor} fontSize='sm'>
                            Dernier changement:{' '}
                            {dayjs(
                              passwordExpiration.lastPasswordChange
                            ).format('DD/MM/YYYY')}
                            <br />
                            Expire le:{' '}
                            {dayjs(passwordExpiration.expirationDate).format(
                              'DD/MM/YYYY'
                            )}
                          </Text>
                        </VStack>
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}

              <FormControl>
                <FormLabel>Nom d&apos;utilisateur</FormLabel>
                <Input isReadOnly value={user.username} />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input isReadOnly value={user.email} />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <VStack align='stretch' spacing={4}>
              <Heading size='md'>Profils sociaux</Heading>
              <SocialProfilesSection />
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <VStack align='stretch' spacing={4}>
              <Heading size='md'>Préférences</Heading>

              <Stack spacing={4}>
                <FormControl alignItems='center' display='flex'>
                  <FormLabel mb={0}>
                    Mode {colorMode === 'dark' ? 'sombre' : 'clair'}
                  </FormLabel>
                  <Switch
                    isChecked={colorMode === 'dark'}
                    onChange={toggleColorMode}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Thème de couleur</FormLabel>
                  <ThemeSelector
                    currentTheme={theme}
                    onThemeChange={changeTheme}
                  />
                </FormControl>
              </Stack>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <form onSubmit={handlePasswordChange}>
              <VStack align='stretch' spacing={4}>
                <Heading size='md'>Changer le mot de passe</Heading>

                <FormControl>
                  <FormLabel>Mot de passe actuel</FormLabel>
                  <Input
                    type='password'
                    value={passwords.current}
                    onChange={e =>
                      setPasswords(prev => ({
                        ...prev,
                        current: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <Input
                    type='password'
                    value={passwords.new}
                    onChange={e =>
                      setPasswords(prev => ({
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
                    type='password'
                    value={passwords.confirm}
                    onChange={e =>
                      setPasswords(prev => ({
                        ...prev,
                        confirm: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                {error && (
                  <Text color='red.500' fontSize='sm'>
                    {error}
                  </Text>
                )}

                <Stack direction='row' justify='flex-end'>
                  <Button
                    colorScheme='blue'
                    isLoading={isLoading}
                    type='submit'
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
  );
};

export default ProfilePage;
