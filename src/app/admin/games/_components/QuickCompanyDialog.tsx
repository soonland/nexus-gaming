'use client';

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import { useCompanies } from '@/hooks/useCompanies';
import type { ICompanyData } from '@/types/api';

interface IQuickCompanyDialogProps {
  isOpen: boolean;
  defaultRole?: 'developer' | 'publisher';
  onClose: () => void;
  onSuccess: (company: ICompanyData) => void;
}

export const QuickCompanyDialog = ({
  isOpen,
  defaultRole,
  onClose,
  onSuccess,
}: IQuickCompanyDialogProps) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isDeveloper, setIsDeveloper] = useState(defaultRole === 'developer');
  const [isPublisher, setIsPublisher] = useState(defaultRole === 'publisher');
  const [roleError, setRoleError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createCompany } = useCompanies();

  const handleClose = () => {
    setName('');
    setNameError('');
    setIsDeveloper(defaultRole === 'developer');
    setIsPublisher(defaultRole === 'publisher');
    setRoleError('');
    onClose();
  };

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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const newCompany = await createCompany({
        name: name.trim(),
        isDeveloper,
        isPublisher,
      });
      onSuccess(newCompany);
      handleClose();
    } catch (error) {
      console.error('Error creating company:', error);
      setNameError("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth='sm' open={isOpen} onClose={handleClose}>
      <DialogTitle>Créer une société</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            required
            error={!!nameError}
            helperText={nameError}
            label='Nom'
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button
          disabled={isSubmitting}
          variant='contained'
          onClick={handleSubmit}
        >
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
