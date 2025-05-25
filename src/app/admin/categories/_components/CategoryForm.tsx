'use client';

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AdminForm } from '@/components/admin/common';
import { useNotifier } from '@/components/common/Notifier';
import { useCategories } from '@/hooks/useCategories';
import type { ICategoryData } from '@/types/api';

interface ICategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    description?: string | null;
    color?: string | null;
    isDefault?: boolean;
    parentId?: string | null;
  };
  mode: 'create' | 'edit';
}

export const CategoryForm = ({ initialData, mode }: ICategoryFormProps) => {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [color, setColor] = useState(initialData?.color || '#007FFF');
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);
  const [parentId, setParentId] = useState(initialData?.parentId || '');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categories, createCategory, updateCategory } = useCategories();
  const { showSuccess, showError } = useNotifier();

  const availableCategories = categories?.filter(
    (cat: ICategoryData) => cat.id !== initialData?.id
  );

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
        description,
        color,
        isDefault,
        parentId: parentId || null,
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
          size='small'
          value={name}
          onChange={e => {
            setName(e.target.value);
            if (nameError) setNameError('');
          }}
        />
        <TextField
          fullWidth
          multiline
          label='Description'
          minRows={2}
          name='description'
          size='small'
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <FormControl fullWidth size='small'>
          <InputLabel>Catégorie parente</InputLabel>
          <Select
            label='Catégorie parente'
            value={parentId}
            onChange={e => setParentId(e.target.value)}
          >
            <MenuItem value=''>Aucune catégorie parente</MenuItem>
            {availableCategories?.map((category: ICategoryData) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack spacing={2}>
          <Stack direction='row' spacing={2}>
            <TextField
              fullWidth
              label='Couleur'
              size='small'
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
          <FormControlLabel
            control={
              <Checkbox
                checked={isDefault}
                onChange={e => setIsDefault(e.target.checked)}
              />
            }
            label='Définir comme catégorie par défaut'
          />
        </Stack>
      </Stack>
    </AdminForm>
  );
};
