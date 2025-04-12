'use client';

import {
  Container,
  Stack,
  Button,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { BsArrowLeft } from 'react-icons/bs';

export default function GameError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <Container maxW='container.xl' py={8}>
      <Stack align='start' spacing={8}>
        <Button
          leftIcon={<Icon as={BsArrowLeft} />}
          variant='ghost'
          onClick={() => router.back()}
        >
          Retour aux jeux
        </Button>

        <Alert
          alignItems='center'
          flexDirection='column'
          height='200px'
          justifyContent='center'
          rounded='lg'
          status='error'
          textAlign='center'
          variant='subtle'
        >
          <AlertIcon boxSize='40px' mr={0} />
          <AlertTitle fontSize='lg' mb={1} mt={4}>
            Jeu non trouvé
          </AlertTitle>
          <AlertDescription maxWidth='sm'>
            {error.message ||
              "Le jeu que vous recherchez n'existe pas ou a été supprimé."}
          </AlertDescription>
        </Alert>

        <Stack align='center' alignSelf='center' direction='row' spacing={4}>
          <Button colorScheme='blue' onClick={reset}>
            Réessayer
          </Button>
          <Button variant='ghost' onClick={() => router.push('/games')}>
            Voir tous les jeux
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
