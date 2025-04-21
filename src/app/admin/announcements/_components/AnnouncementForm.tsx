'use client';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import type { AnnouncementType } from '@prisma/client';
import type { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AdminForm } from '@/components/admin/common';
import { useNotifier } from '@/components/common/Notifier';
import { useAdminAnnouncement } from '@/hooks/useAdminAnnouncement';
import type { ActiveStatus } from '@/hooks/useAdminAnnouncement';
import dayjs from '@/lib/dayjs';

const ANNOUNCEMENT_TYPES: { value: AnnouncementType; label: string }[] = [
  { value: 'INFO', label: 'Information' },
  { value: 'ATTENTION', label: 'Attention' },
  { value: 'URGENT', label: 'Urgent' },
];

const STATUS_OPTIONS: { value: ActiveStatus; label: string }[] = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
];

interface IAnnouncementFormProps {
  initialData?: {
    id: string;
    message: string;
    type: AnnouncementType;
    isActive: ActiveStatus;
    expiresAt?: string | null;
  };
  mode: 'create' | 'edit';
}

export const AnnouncementForm = ({
  initialData,
  mode,
}: IAnnouncementFormProps) => {
  const router = useRouter();
  const [message, setMessage] = useState(initialData?.message || '');
  const [messageError, setMessageError] = useState('');
  const [type, setType] = useState<AnnouncementType>(
    initialData?.type || 'INFO'
  );
  const [isActive, setIsActive] = useState<ActiveStatus>(
    initialData?.isActive || 'active'
  );
  const [expiresAt, setExpiresAt] = useState<Dayjs | null>(
    initialData?.expiresAt ? dayjs(initialData.expiresAt) : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createAnnouncement, updateAnnouncement } = useAdminAnnouncement();
  const { showSuccess, showError } = useNotifier();

  const validateForm = () => {
    let isValid = true;

    if (!message.trim()) {
      setMessageError('Le message est requis');
      isValid = false;
    } else if (message.trim().length < 3) {
      setMessageError('Le message doit contenir au moins 3 caractères');
      isValid = false;
    } else {
      setMessageError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        message: message.trim(),
        type,
        isActive,
        expiresAt: expiresAt?.toDate(),
      };

      if (mode === 'create') {
        await createAnnouncement.mutateAsync(data);
        showSuccess('Annonce créée avec succès');
      } else if (initialData?.id) {
        await updateAnnouncement.mutateAsync({
          id: initialData.id,
          ...data,
        });
        showSuccess('Annonce modifiée avec succès');
      }

      router.push('/admin/announcements');
      router.refresh();
    } catch (error) {
      console.error('Error saving announcement:', error);
      showError("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminForm
      cancelHref='/admin/announcements'
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    >
      <Stack spacing={3}>
        <TextField
          autoFocus
          fullWidth
          multiline
          required
          error={!!messageError}
          helperText={messageError}
          label='Message'
          name='message'
          rows={4}
          value={message}
          onChange={e => {
            setMessage(e.target.value);
            if (messageError) setMessageError('');
          }}
        />
        <FormControl>
          <InputLabel id='type-label'>Type</InputLabel>
          <Select
            required
            label='Type'
            labelId='type-label'
            name='type'
            value={type}
            onChange={e => setType(e.target.value as AnnouncementType)}
          >
            {ANNOUNCEMENT_TYPES.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id='status-label'>État</InputLabel>
          <Select
            required
            label='État'
            labelId='status-label'
            name='isActive'
            value={isActive}
            onChange={e => setIsActive(e.target.value as ActiveStatus)}
          >
            {STATUS_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <DateTimePicker
            label="Date d'expiration"
            value={expiresAt}
            onChange={date => setExpiresAt(date)}
          />
        </FormControl>
      </Stack>
    </AdminForm>
  );
};
