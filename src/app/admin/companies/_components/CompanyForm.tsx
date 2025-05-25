'use client';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AdminForm } from '@/components/admin';
import { useNotifier } from '@/components/common/Notifier';
import { useCompanies } from '@/hooks/useCompanies';

interface ICompanyFormProps {
  initialData?: {
    id: string;
    name: string;
    isDeveloper: boolean;
    isPublisher: boolean;
  };
  mode: 'create' | 'edit';
}

export const CompanyForm = ({ initialData, mode }: ICompanyFormProps) => {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [nameError, setNameError] = useState('');
  const [isDeveloper, setIsDeveloper] = useState(
    initialData?.isDeveloper || false
  );
  const [isPublisher, setIsPublisher] = useState(
    initialData?.isPublisher || false
  );
  const [roleError, setRoleError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createCompany, updateCompany } = useCompanies();
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

    if (!isDeveloper && !isPublisher) {
      setRoleError('La société doit être développeur et/ou éditeur');
      isValid = false;
    } else {
      setRoleError('');
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
        name: name.trim(),
        isDeveloper,
        isPublisher,
      };

      if (mode === 'create') {
        await createCompany(data);
        showSuccess('Société créée avec succès');
      } else if (initialData?.id) {
        await updateCompany({ id: initialData.id, data });
        showSuccess('Société modifiée avec succès');
      }

      router.push('/admin/companies');
      router.refresh();
    } catch (error) {
      console.error('Error saving company:', error);
      showError("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminForm
      cancelHref='/admin/companies'
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
        <FormControl error={!!roleError}>
          <Stack>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDeveloper}
                  size='small'
                  onChange={e => {
                    setIsDeveloper(e.target.checked);
                    if (roleError) setRoleError('');
                  }}
                />
              }
              label='Développeur'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPublisher}
                  size='small'
                  onChange={e => {
                    setIsPublisher(e.target.checked);
                    if (roleError) setRoleError('');
                  }}
                />
              }
              label='Éditeur'
            />
          </Stack>
          {roleError && <FormHelperText>{roleError}</FormHelperText>}
        </FormControl>
      </Stack>
    </AdminForm>
  );
};
