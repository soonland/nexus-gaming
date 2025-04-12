'use client';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Stack,
  Input,
  Checkbox,
} from '@chakra-ui/react';
import React from 'react';

interface CompanyFormData {
  name: string;
  isDeveloper: boolean;
  isPublisher: boolean;
}

interface CompanyFormProps {
  initialData?: CompanyFormData;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export default function CompanyForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: CompanyFormProps) {
  const [formData, setFormData] = React.useState<CompanyFormData>({
    name: initialData?.name || '',
    isDeveloper: initialData?.isDeveloper || false,
    isPublisher: initialData?.isPublisher || false,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      return;
    }

    if (!formData.isDeveloper && !formData.isPublisher) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <Box as='form' onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Nom</FormLabel>
          <Input
            placeholder='Nom de la société'
            value={formData.name}
            onChange={e =>
              setFormData(prev => ({ ...prev, name: e.target.value }))
            }
          />
        </FormControl>

        <FormControl>
          <Stack spacing={2}>
            <Checkbox
              isChecked={formData.isDeveloper}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  isDeveloper: e.target.checked,
                }))
              }
            >
              Développeur
            </Checkbox>
            <Checkbox
              isChecked={formData.isPublisher}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  isPublisher: e.target.checked,
                }))
              }
            >
              Éditeur
            </Checkbox>
          </Stack>
        </FormControl>

        <Stack
          direction='row'
          justify='flex-end'
          pt={4}
          spacing={4}
          width='100%'
        >
          <Button variant='ghost' onClick={onCancel}>
            Annuler
          </Button>
          <Button colorScheme='blue' isLoading={isLoading} type='submit'>
            {mode === 'create' ? 'Créer' : 'Mettre à jour'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
