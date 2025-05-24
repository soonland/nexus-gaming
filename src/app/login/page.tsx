'use client';

import {
  Box,
  Button,
  Container,
  FormControl,
  Stack,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';

const LoginContent = () => {
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || undefined;
  const [isLoading, setIsLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Don't redirect immediately on user change to allow loading overlay to work
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    if (user) {
      // Small delay to allow loading overlay to show
      redirectTimer = setTimeout(() => {
        router.replace(redirectTo || '/games');
      }, 100);
    }
    return () => clearTimeout(redirectTimer);
  }, [user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login({ email, password }, redirectTo);
      setToast({
        open: true,
        message: 'Connexion réussie',
        severity: 'success',
      });
    } catch {
      setToast({
        open: true,
        message: 'Email ou mot de passe incorrect',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show the login form if we're authenticated and about to redirect
  if (user) {
    return null;
  }

  return (
    <>
      <Container maxWidth='sm' sx={{ py: 8 }}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            p: 4,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Stack spacing={3}>
            <Typography align='center' variant='h4'>
              Connexion
            </Typography>
            <Typography align='center'>
              Connectez-vous à votre compte
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <FormControl fullWidth required>
                  <TextField
                    autoComplete='email'
                    label='Email'
                    name='email'
                    placeholder='votre@email.com'
                    size='small'
                    type='email'
                    variant='outlined'
                  />
                </FormControl>

                <FormControl fullWidth required>
                  <TextField
                    autoComplete='current-password'
                    label='Mot de passe'
                    name='password'
                    placeholder='Votre mot de passe'
                    size='small'
                    type='password'
                    variant='outlined'
                  />
                </FormControl>

                <Button
                  disabled={isLoading}
                  size='large'
                  sx={{ fontSize: '1rem' }}
                  type='submit'
                  variant='contained'
                >
                  Se connecter
                </Button>
              </Stack>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Divider sx={{ my: 2 }}>ou</Divider>
              <Typography color='text.secondary' sx={{ mb: 2 }} variant='body2'>
                Pas encore de compte ?
              </Typography>
              <Button
                variant='outlined'
                onClick={() => router.push('/register')}
              >
                Créer un compte
              </Button>
            </Box>
          </Stack>
        </Box>
      </Container>

      <Snackbar
        autoHideDuration={3000}
        open={toast.open}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
