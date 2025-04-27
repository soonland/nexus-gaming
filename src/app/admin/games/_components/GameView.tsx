import { Paper } from '@mui/material';

import type { IGameData } from '@/types/api';

import { GameContent } from './GameContent';

interface IGameViewProps {
  game: IGameData;
}

export const GameView = ({ game }: IGameViewProps) => {
  return (
    <Paper sx={{ p: 4 }}>
      <GameContent game={game} />
    </Paper>
  );
};
