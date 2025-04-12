'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';
import React from 'react';

import { useCompanies } from '@/hooks/useCompanies';
import type { CompanyData } from '@/types';

interface QuickCompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'developer' | 'publisher';
  onSuccess: (newCompany: CompanyData) => void;
}

export default function QuickCompanyForm({
  isOpen,
  onClose,
  type,
  onSuccess,
}: QuickCompanyFormProps) {
  const [name, setName] = React.useState('');
  const toast = useToast();
  const { createCompany, isCreating } = useCompanies();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      createCompany(
        {
          name: name.trim(),
          isDeveloper: type === 'developer',
          isPublisher: type === 'publisher',
        },
        {
          onSuccess: newCompany => {
            toast({
              title: 'Société créée',
              status: 'success',
              duration: 3000,
            });
            onSuccess(newCompany);
            onClose();
            setName('');
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

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as='form' onSubmit={handleSubmit}>
        <ModalHeader>
          Ajouter un {type === 'developer' ? 'développeur' : 'éditeur'}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nom</FormLabel>
              <Input
                autoFocus
                placeholder='Nom de la société'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} variant='ghost' onClick={onClose}>
            Annuler
          </Button>
          <Button colorScheme='blue' isLoading={isCreating} type='submit'>
            Créer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
