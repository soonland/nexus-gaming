'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { useBroadcastNotification } from '@/hooks/admin/useBroadcastNotification';
import type { NotificationLevel } from '@/types/notifications';

const NOTIFICATION_LEVELS: { value: NotificationLevel; label: string }[] = [
  { value: 'info', label: 'Information' },
  { value: 'warning', label: 'Avertissement' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'error', label: 'Erreur' },
];

export const BroadcastForm = () => {
  const router = useRouter();
  const broadcastMutation = useBroadcastNotification();

  const [formData, setFormData] = useState({
    level: 'info' as NotificationLevel,
    title: '',
    message: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await broadcastMutation.mutateAsync({
        type: 'SYSTEM_ALERT',
        ...formData,
        expiresAt: null,
      });
      router.push('/admin');
    } catch (error) {
      console.error('Error broadcasting notification:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel id='level-label'>Niveau</InputLabel>
              <Select
                label='Niveau'
                labelId='level-label'
                value={formData.level}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    level: e.target.value as NotificationLevel,
                  }))
                }
              >
                {NOTIFICATION_LEVELS.map(level => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              required
              error={!formData.title}
              label='Titre'
              value={formData.title}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />

            <TextField
              fullWidth
              multiline
              required
              error={!formData.message}
              label='Message'
              rows={4}
              value={formData.message}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  message: e.target.value,
                }))
              }
            />

            {broadcastMutation.error && (
              <Box sx={{ color: 'error.main', mt: 2, mb: 1 }}>
                Une erreur est survenue lors de l'envoi de la notification
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type='button'
                variant='outlined'
                onClick={() => router.push('/admin')}
              >
                Annuler
              </Button>
              <Button
                disabled={
                  broadcastMutation.isPending ||
                  !formData.title.trim() ||
                  !formData.message.trim()
                }
                type='submit'
                variant='contained'
              >
                Envoyer
              </Button>
            </Box>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};
