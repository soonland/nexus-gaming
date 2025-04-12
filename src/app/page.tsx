'use client';

import { Box, Container, Heading, Text } from '@chakra-ui/react';

const Home = () => {
  return (
    <Container maxW='container.xl' py={8}>
      <Box py={10} textAlign='center'>
        <Heading as='h1' mb={4} size='2xl'>
          Nexus Gaming
        </Heading>
        <Text color='gray.600' fontSize='xl'>
          Your gaming community hub
        </Text>
      </Box>
    </Container>
  );
};

export default Home;
