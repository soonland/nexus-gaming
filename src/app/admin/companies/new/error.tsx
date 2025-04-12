'use client';

import {
  Container,
  VStack,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const NewCompanyError = ({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) => {
  const router = useRouter();

  return (
    <Container maxW='container.md' py={8}>
      <VStack align='stretch' spacing={8}>
        <Alert
          alignItems='center'
          borderRadius='lg'
          flexDirection='column'
          height='200px'
          justifyContent='center'
          status='error'
          textAlign='center'
          variant='subtle'
        >
          <AlertIcon boxSize='40px' mr={0} />
          <AlertTitle fontSize='lg' mb={1} mt={4}>
            Une erreur est survenue
          </AlertTitle>
          <AlertDescription maxWidth='sm'>
            {error.message || 'Impossible de charger le formulaire de création'}
          </AlertDescription>
        </Alert>

        <VStack spacing={4}>
          <Button colorScheme='blue' onClick={() => reset()}>
            Réessayer
          </Button>
          <Button
            variant='ghost'
            onClick={() => router.push('/admin/companies')}
          >
            Retour à la liste
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
};

export default NewCompanyError;
