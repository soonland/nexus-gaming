'use client';

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  TextField,
} from '@mui/material';
import type { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import {
  MdBuild as MaintenanceIcon,
  MdNewReleases as NewFeatureIcon,
  MdSystemUpdate as UpdateIcon,
} from 'react-icons/md';

import { ROLE_STYLES } from '@/app/admin/users/_components/userStyles';
import { useBroadcastNotification } from '@/hooks/admin/useBroadcastNotification';
import type { NotificationLevel } from '@/types/notifications';

const NOTIFICATION_LEVELS: { value: NotificationLevel; label: string }[] = [
  { value: 'info', label: 'Information' },
  { value: 'warning', label: 'Avertissement' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'error', label: 'Erreur' },
];

interface IMessageTemplate {
  label: string;
  title: string;
  message: string;
  icon: React.ComponentType;
  level: NotificationLevel;
  roleMin: Role;
}

const MESSAGE_TEMPLATES: IMessageTemplate[] = [
  {
    label: 'Maintenance planifiée',
    title: 'Maintenance système prévue',
    message:
      'Une maintenance système est planifiée. Le service sera temporairement indisponible.',
    icon: MaintenanceIcon,
    level: 'warning',
    roleMin: 'USER',
  },
  {
    label: 'Nouvelle fonctionnalité',
    title: 'Nouvelle fonctionnalité disponible',
    message:
      "Une nouvelle fonctionnalité vient d'être déployée. Découvrez-la dès maintenant !",
    icon: NewFeatureIcon,
    level: 'info',
    roleMin: 'EDITOR',
  },
  {
    label: 'Mise à jour importante',
    title: 'Mise à jour majeure',
    message:
      "Une mise à jour importante du système vient d'être effectuée. Consultez les changements.",
    icon: UpdateIcon,
    level: 'urgent',
    roleMin: 'MODERATOR',
  },
];

// La liste ordonnée des rôles pour le menu et le helper text
const roleHierarchy: Role[] = [
  'USER',
  'MODERATOR',
  'EDITOR',
  'SENIOR_EDITOR',
  'ADMIN',
  'SYSADMIN',
];

// Fonction pour obtenir la liste des destinataires basée sur le rôle minimum
const getRecipientsText = (roleMin: Role): string => {
  const index = roleHierarchy.indexOf(roleMin);
  const roles = roleHierarchy.slice(index);
  const roleLabels = roles.map(role => ROLE_STYLES[role].label);

  if (roleLabels.length === 1) {
    return `Sera envoyé aux ${roleLabels[0].toLowerCase()}s`;
  }

  return `Sera envoyé aux ${roleLabels.map(label => label.toLowerCase()).join(', ')}`;
};

export const BroadcastForm = () => {
  const router = useRouter();
  const broadcastMutation = useBroadcastNotification();

  const [formData, setFormData] = useState({
    level: 'info' as NotificationLevel,
    title: '',
    message: '',
    roleMin: 'USER' as Role,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await broadcastMutation.mutateAsync({
        type: 'SYSTEM_ALERT',
        level: formData.level,
        title: formData.title,
        message: formData.message,
        roleMin: formData.roleMin,
        expiresAt: null,
      });
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error broadcasting notification:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* Section Templates */}
            <Stack spacing={2}>
              <Typography variant='h6'>Templates</Typography>
              <Typography color='text.secondary' variant='body2'>
                Sélectionnez un modèle prédéfini ou créez une notification
                personnalisée ci-dessous
              </Typography>
              <ButtonGroup fullWidth size='small' variant='outlined'>
                {MESSAGE_TEMPLATES.map(template => (
                  <Tooltip key={template.label} title='Utiliser ce modèle'>
                    <Button
                      startIcon={<template.icon />}
                      onClick={() =>
                        setFormData({
                          level: template.level,
                          title: template.title,
                          message: template.message,
                          roleMin: template.roleMin,
                        })
                      }
                    >
                      {template.label}
                    </Button>
                  </Tooltip>
                ))}
              </ButtonGroup>
            </Stack>

            <Divider />

            {/* Section Notification manuelle */}
            <Stack spacing={3}>
              <Typography variant='h6'>Notification manuelle</Typography>
              <FormControl fullWidth size='small'>
                <InputLabel id='level-label'>Niveau</InputLabel>
                <Select
                  label='Niveau'
                  labelId='level-label'
                  size='small'
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

              <FormControl fullWidth size='small' sx={{ mb: 1 }}>
                <InputLabel id='role-min-label'>Destinataires</InputLabel>
                <Select
                  label='Destinataires'
                  labelId='role-min-label'
                  value={formData.roleMin}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      roleMin: e.target.value as Role,
                    }))
                  }
                >
                  {roleHierarchy.map(role => (
                    <MenuItem key={role} value={role}>
                      {ROLE_STYLES[role].label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {getRecipientsText(formData.roleMin)}
                </FormHelperText>
              </FormControl>

              <TextField
                fullWidth
                required
                error={!formData.title}
                label='Titre'
                size='small'
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
                size='small'
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
              {broadcastMutation.error && (
                <Box sx={{ color: 'error.main', mt: 2, mb: 1 }}>
                  Une erreur est survenue lors de l'envoi de la notification
                </Box>
              )}
            </Stack>

            <Divider />

            {/* Section Actions */}
            <Stack spacing={2}>
              <Typography variant='h6'>Actions</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type='button'
                  variant='outlined'
                  onClick={() => router.push('/admin/dashboard')}
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
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};
