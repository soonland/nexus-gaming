'use client';

import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from '@chakra-ui/react';

import { useGames } from '@/hooks/useGames';

import GameForm from '../_components/GameForm';

const NewGamePage = () => {
  const { createGame, isCreating } = useGames();

  return (
    <Container maxW='container.md' py={8}>
      <Card>
        <CardHeader>
          <Heading size='lg'>Nouveau jeu</Heading>
        </CardHeader>
        <CardBody>
          <GameForm
            isLoading={isCreating}
            mode='create'
            onSubmit={createGame}
          />
        </CardBody>
      </Card>
    </Container>
  );
};

export default NewGamePage;
