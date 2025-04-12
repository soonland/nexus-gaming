'use client';

import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  useToast,
  Checkbox,
  Stack,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import React from 'react';

import { useCompanies } from '@/hooks/useCompanies';
import type { CompanyData } from '@/types';

interface IInlineCompanyCreationProps {
  type: 'developer' | 'publisher';
  onSuccess: (newCompany: CompanyData) => void;
  onCancel: () => void;
}

const InlineCompanyCreation = ({
  type,
  onSuccess,
  onCancel,
}: IInlineCompanyCreationProps) => {
  const [formData, setFormData] = React.useState({
    name: '',
    isDeveloper: type === 'developer',
    isPublisher: type === 'publisher',
  });
  const [error, setError] = React.useState<string | null>(null);
  const toast = useToast();
  const { createCompany, isCreating } = useCompanies();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Focus the input when component mounts
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (isCreating) return;

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setError('Le nom est requis');
      return;
    }

    if (!formData.isDeveloper && !formData.isPublisher) {
      setError('Sélectionnez au moins un rôle');
      return;
    }

    setError(null);

    try {
      createCompany(
        {
          name: trimmedName,
          isDeveloper: formData.isDeveloper,
          isPublisher: formData.isPublisher,
        },
        {
          onSuccess: newCompany => {
            toast({
              title: 'Société créée',
              status: 'success',
              duration: 3000,
            });
            onSuccess(newCompany);
          },
          onError: () => {
            toast({
              title: 'Erreur',
              description: 'Impossible de créer la société',
              status: 'error',
              duration: 5000,
            });
          },
        }
      );
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Box mt={2}>
      <VStack align='stretch' spacing={2}>
        <FormControl isInvalid={!!error}>
          <Input
            ref={inputRef}
            isDisabled={isCreating}
            placeholder='Nom de la société'
            size='sm'
            value={formData.name}
            onChange={e => {
              setFormData(prev => ({ ...prev, name: e.target.value }));
              setError(null);
            }}
            onKeyDown={handleKeyDown}
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>

        <Stack direction='row' spacing={4}>
          <Checkbox
            isChecked={formData.isDeveloper}
            isDisabled={isCreating}
            size='sm'
            onChange={e => {
              setFormData(prev => ({ ...prev, isDeveloper: e.target.checked }));
              setError(null);
            }}
          >
            Développeur
          </Checkbox>
          <Checkbox
            isChecked={formData.isPublisher}
            isDisabled={isCreating}
            size='sm'
            onChange={e => {
              setFormData(prev => ({ ...prev, isPublisher: e.target.checked }));
              setError(null);
            }}
          >
            Éditeur
          </Checkbox>
        </Stack>

        <HStack justify='flex-end'>
          <IconButton
            aria-label='Valider'
            colorScheme='green'
            icon={<CheckIcon />}
            isDisabled={!formData.name.trim()}
            isLoading={isCreating}
            size='sm'
            onClick={() => handleSubmit()}
          />
          <IconButton
            aria-label='Annuler'
            icon={<CloseIcon />}
            isDisabled={isCreating}
            size='sm'
            variant='ghost'
            onClick={onCancel}
          />
        </HStack>
      </VStack>
    </Box>
  );
};

export default InlineCompanyCreation;
