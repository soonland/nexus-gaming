'use client';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Container,
} from '@chakra-ui/react';
import { useEffect } from 'react';

const UserListError = ({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) => {
  useEffect(() => {
    console.error('Users page error:', error);
  }, [error]);

  return (
    <Container maxW='container.xl' py={8}>
      <Alert
        alignItems='center'
        borderRadius='md'
        flexDirection='column'
        height='200px'
        justifyContent='center'
        status='error'
        textAlign='center'
        variant='subtle'
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle fontSize='lg' mb={1} mt={4}>
          Error Loading Users
        </AlertTitle>
        <AlertDescription maxWidth='sm' mb={4}>
          {error.message ||
            'An unexpected error occurred while loading the users.'}
        </AlertDescription>
        <Button colorScheme='red' onClick={reset}>
          Try Again
        </Button>
      </Alert>
    </Container>
  );
};

export default UserListError;
