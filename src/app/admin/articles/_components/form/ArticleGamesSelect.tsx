'use client';

import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';

import type { IArticleGamesSelectProps } from './types';

export const ArticleGamesSelect = ({
  gameIds,
  games,
  onGamesChange,
}: IArticleGamesSelectProps) => {
  return (
    <FormControl>
      <InputLabel id='games-label'>Jeux associés</InputLabel>
      <Select
        multiple
        input={<OutlinedInput label='Jeux associés' />}
        label='Jeux associés'
        labelId='games-label'
        name='gameIds'
        renderValue={selected => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map(gameId => {
              const game = games?.find(g => g.id === gameId);
              return game ? <Chip key={gameId} label={game.title} /> : null;
            })}
          </Box>
        )}
        value={gameIds}
        onChange={e => {
          const value = e.target.value;
          onGamesChange(typeof value === 'string' ? value.split(',') : value);
        }}
      >
        {games?.map(game => (
          <MenuItem key={game.id} value={game.id}>
            {game.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
