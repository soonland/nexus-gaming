'use client';

import { Paper, Stack, TextField } from '@mui/material';

import type { IGameMainContentProps } from './types';

export const GameMainContent = ({
  title,
  slug,
  description,
  titleError,
  onTitleChange,
  onDescriptionChange,
}: IGameMainContentProps) => {
  return (
    <Paper
      elevation={2}
      sx={{
        flex: 1,
        p: 3,
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Stack spacing={3}>
        <TextField
          autoFocus
          fullWidth
          required
          error={!!titleError}
          helperText={titleError}
          label='Titre'
          name='title'
          size='small'
          value={title}
          onChange={e => onTitleChange(e.target.value)}
        />
        <TextField
          fullWidth
          label='Slug'
          name='slug'
          size='small'
          value={slug}
        />
        <TextField
          fullWidth
          multiline
          label='Description'
          name='description'
          rows={8}
          size='small'
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
        />
      </Stack>
    </Paper>
  );
};
