'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { useRegister } from '@/hooks/useRegister';

const RegisterPage = () => {
  const router = useRouter();
  const { register, isLoading, error } = useRegister();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "L'email est invalide";
    }

    if (!formData.username) {
      errors.username = "Le nom d'utilisateur est requis";
    } else if (formData.username.length < 3) {
      errors.username =
        "Le nom d'utilisateur doit contenir au moins 3 caractères";
    }

    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword: _, ...registerData } = formData;
    await register(registerData);
  };

  return (
    <Container maxWidth='sm' sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography gutterBottom variant='h5'>
            Créer un compte
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl error={!!validationErrors.email}>
                <TextField
                  fullWidth
                  required
                  error={!!validationErrors.email}
                  label='Email'
                  size='small'
                  type='email'
                  value={formData.email}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                  }
                />
                {validationErrors.email && (
                  <FormHelperText>{validationErrors.email}</FormHelperText>
                )}
              </FormControl>

              <FormControl error={!!validationErrors.username}>
                <TextField
                  fullWidth
                  required
                  error={!!validationErrors.username}
                  label="Nom d'utilisateur"
                  size='small'
                  value={formData.username}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, username: e.target.value }))
                  }
                />
                {validationErrors.username && (
                  <FormHelperText>{validationErrors.username}</FormHelperText>
                )}
              </FormControl>

              <FormControl error={!!validationErrors.password}>
                <TextField
                  fullWidth
                  required
                  error={!!validationErrors.password}
                  label='Mot de passe'
                  size='small'
                  type='password'
                  value={formData.password}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, password: e.target.value }))
                  }
                />
                {validationErrors.password && (
                  <FormHelperText>{validationErrors.password}</FormHelperText>
                )}
              </FormControl>

              <FormControl error={!!validationErrors.confirmPassword}>
                <TextField
                  fullWidth
                  required
                  error={!!validationErrors.confirmPassword}
                  label='Confirmer le mot de passe'
                  size='small'
                  type='password'
                  value={formData.confirmPassword}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
                {validationErrors.confirmPassword && (
                  <FormHelperText>
                    {validationErrors.confirmPassword}
                  </FormHelperText>
                )}
              </FormControl>

              {error && (
                <Typography color='error' variant='body2'>
                  {error.message}
                </Typography>
              )}

              <Button
                fullWidth
                disabled={isLoading}
                sx={{ mt: 2 }}
                type='submit'
                variant='contained'
              >
                S'inscrire
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography color='text.secondary' variant='body2'>
                  Vous possédez déjà un compte ?
                </Typography>
                <Button variant='text' onClick={() => router.push('/login')}>
                  Se connecter
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegisterPage;
