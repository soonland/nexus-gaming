'use client';

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const { login, user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      router.replace('/games');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login({ email, password });
      toast({
        title: 'Connexion réussie',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: 'Email ou mot de passe incorrect',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW='container.sm' py={8}>
      <Box
        bg='bg.surface'
        borderColor='border.default'
        borderWidth='1px'
        p={8}
        rounded='lg'
        shadow='base'
      >
        <Stack spacing={4}>
          <Heading size='lg' textAlign='center'>
            Connexion
          </Heading>
          <Text textAlign='center'>Connectez-vous à votre compte</Text>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  autoComplete='email'
                  name='email'
                  placeholder='votre@email.com'
                  type='email'
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Mot de passe</FormLabel>
                <Input
                  autoComplete='current-password'
                  name='password'
                  placeholder='Votre mot de passe'
                  type='password'
                />
              </FormControl>

              <Button
                colorScheme='blue'
                fontSize='md'
                isLoading={isLoading}
                size='lg'
                type='submit'
              >
                Se connecter
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Container>
  );
};

export default LoginPage;
