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

interface IPasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const PasswordForm = () => {
  const { showSuccess, showError } = useNotifier();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<IPasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || 'Erreur lors de la mise à jour du mot de passe'
        );
      }

      showSuccess('Mot de passe mis à jour avec succès');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la mise à jour du mot de passe'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card component='form' id='password-form' onSubmit={handleSubmit}>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant='h6'>Changer le mot de passe</Typography>
          <TextField
            fullWidth
            label='Mot de passe actuel'
            type='password'
            value={formData.currentPassword}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
          />
          <TextField
            fullWidth
            label='Nouveau mot de passe'
            type='password'
            value={formData.newPassword}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
          />
          <TextField
            fullWidth
            error={
              formData.confirmPassword !== '' &&
              formData.newPassword !== formData.confirmPassword
            }
            helperText={
              formData.confirmPassword !== '' &&
              formData.newPassword !== formData.confirmPassword
                ? 'Les mots de passe ne correspondent pas'
                : undefined
            }
            label='Confirmer le mot de passe'
            type='password'
            value={formData.confirmPassword}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                confirmPassword: e.target.value,
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
              'Changer le mot de passe'
            )}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
