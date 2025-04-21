import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useNotifier } from '@/components/common/Notifier';
import { useAuth } from '@/hooks/useAuth';

interface IBasicInfoFormData {
  username: string;
  email: string;
}

export const BasicInfoForm = () => {
  const { user, refresh } = useAuth();
  const { showSuccess, showError } = useNotifier();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<IBasicInfoFormData>({
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || 'Erreur lors de la mise à jour du profil'
        );
      }

      await refresh();
      showSuccess('Profil mis à jour avec succès');
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la mise à jour du profil'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card component='form' onSubmit={handleSubmit}>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant='h6'>Informations de base</Typography>
          <TextField
            fullWidth
            label="Nom d'utilisateur"
            value={formData.username}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                username: e.target.value,
              }))
            }
          />
          <TextField
            fullWidth
            label='Email'
            type='email'
            value={formData.email}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
          <Button
            disabled={isSubmitting}
            size='large'
            type='submit'
            variant='contained'
          >
            {isSubmitting ? (
              <Stack alignItems='center' direction='row' spacing={1}>
                <CircularProgress size={20} />
                <span>Mise à jour...</span>
              </Stack>
            ) : (
              'Mettre à jour'
            )}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
