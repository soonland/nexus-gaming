'use client';

import { Box, Stack, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AdminForm } from '@/components/admin/common';
import { useNotifier } from '@/components/common/Notifier';
import { useCategories } from '@/hooks/useCategories';

interface ICategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    color?: string | null;
  };
  mode: 'create' | 'edit';
}

export const CategoryForm = ({ initialData, mode }: ICategoryFormProps) => {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [color, setColor] = useState(initialData?.color || '#007FFF');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createCategory, updateCategory } = useCategories();
  const { showSuccess, showError } = useNotifier();

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
        name,
        color,
      };

      if (mode === 'create') {
        await createCategory(data);
        showSuccess('Catégorie créée avec succès');
      } else if (initialData?.id) {
        await updateCategory({ id: initialData.id, data });
        showSuccess('Catégorie modifiée avec succès');
      }
      router.push('/admin/categories');
      router.refresh();
    } catch (error) {
      console.error('Error saving category:', error);
      showError("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminForm
      cancelHref='/admin/categories'
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
        <Stack direction='row' spacing={2}>
          <TextField
            fullWidth
            label='Couleur'
            sx={{
              '& .MuiInputBase-input': {
                p: 1,
                height: 40,
              },
            }}
            type='color'
            value={color}
            onChange={e => setColor(e.target.value)}
          />
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: color,
              border: '2px solid',
              borderColor: 'divider',
              flexShrink: 0,
            }}
          />
        </Stack>
      </Stack>
    </AdminForm>
  );
};
