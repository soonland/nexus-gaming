'use client';

import { Paper, Stack, TextField } from '@mui/material';

import type { IArticleMainContentProps } from './types';

export const ArticleMainContent = ({
  title,
  content,
  titleError,
  contentError,
  onTitleChange,
  onContentChange,
}: IArticleMainContentProps) => {
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
          value={title}
          onChange={e => onTitleChange(e.target.value)}
        />

        <TextField
          fullWidth
          multiline
          required
          error={!!contentError}
          helperText={contentError}
          label='Contenu'
          name='content'
          rows={12}
          value={content}
          onChange={e => onContentChange(e.target.value)}
        />
      </Stack>
    </Paper>
  );
};
