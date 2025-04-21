'use client';

import { FormControl, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AdminForm } from '@/components/admin/common';
import { useNotifier } from '@/components/common/Notifier';
import { usePlatforms } from '@/hooks/usePlatforms';
import dayjs from '@/lib/dayjs';

interface IPlatformFormProps {
  initialData?: {
    id: string;
    name: string;
    manufacturer: string;
    releaseDate?: string | null;
  };
  mode: 'create' | 'edit';
}

export const PlatformForm = ({ initialData, mode }: IPlatformFormProps) => {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [nameError, setNameError] = useState('');
  const [manufacturer, setManufacturer] = useState(
    initialData?.manufacturer || ''
  );
  const [manufacturerError, setManufacturerError] = useState('');
  const [releaseDate, setReleaseDate] = useState<Dayjs | null>(
    initialData?.releaseDate ? dayjs(initialData.releaseDate) : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPlatform, updatePlatform } = usePlatforms({
    page: 1,
    limit: 10,
  });

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Le nom est requis');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Le nom doit contenir au moins 2 caractères');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!manufacturer.trim()) {
      setManufacturerError('Le fabricant est requis');
      isValid = false;
    } else if (manufacturer.trim().length < 2) {
      setManufacturerError('Le fabricant doit contenir au moins 2 caractères');
      isValid = false;
    } else {
      setManufacturerError('');
    }

    return isValid;
  };

  const { showSuccess, showError } = useNotifier();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        name,
        manufacturer,
        releaseDate: releaseDate
          ? dayjs(releaseDate).format('YYYY-MM-DD')
          : null,
      };

      if (mode === 'create') {
        await createPlatform(data);
        showSuccess('Plateforme créée avec succès');
      } else if (initialData?.id) {
        await updatePlatform({ id: initialData.id, data });
        showSuccess('Plateforme modifiée avec succès');
      }
      router.push('/admin/platforms');
      router.refresh();
    } catch (error) {
      console.error('Error saving platform:', error);
      showError("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminForm
      cancelHref='/admin/platforms'
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    >
      <Stack spacing={3}>
        <TextField
          autoFocus
          fullWidth
          required
          error={!!nameError}
          helperText={nameError}
          label='Nom'
          name='name'
          value={name}
          onChange={e => {
            setName(e.target.value);
            if (nameError) setNameError('');
          }}
        />
        <TextField
          fullWidth
          required
          error={!!manufacturerError}
          helperText={manufacturerError}
          label='Fabricant'
          name='manufacturer'
          value={manufacturer}
          onChange={e => {
            setManufacturer(e.target.value);
            if (manufacturerError) setManufacturerError('');
          }}
        />
        <FormControl>
          <DatePicker
            label='Date de sortie'
            value={releaseDate}
            onChange={date => setReleaseDate(date)}
          />
        </FormControl>
      </Stack>
    </AdminForm>
  );
};
