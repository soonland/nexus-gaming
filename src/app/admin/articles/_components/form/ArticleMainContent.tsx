'use client';

import {
  Box,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { MdCheck as CheckIcon, MdError as ErrorIcon } from 'react-icons/md';

import type { IArticleMainContentProps } from './types';

const EDIT_MODE_MESSAGE =
  "Le slug ne peut pas être modifié après la création de l'article";

export const ArticleMainContent = ({
  title,
  slug,
  content,
  titleError,
  contentError,
  onTitleChange,
  onContentChange,
  slugError,
  isCheckingSlug,
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
          size='small'
          value={title}
          onChange={e => onTitleChange(e.target.value)}
        />

        <TextField
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position='end'>
                {isCheckingSlug ? (
                  <CircularProgress size={20} />
                ) : slugError ? (
                  <Box component={ErrorIcon} sx={{ color: 'error.main' }} />
                ) : slug ? (
                  <Box component={CheckIcon} sx={{ color: 'success.main' }} />
                ) : null}
              </InputAdornment>
            ),
            sx: {
              bgcolor: theme => theme.palette.action.hover,
            },
          }}
          error={!!slugError}
          helperText={slugError || (slug ? EDIT_MODE_MESSAGE : undefined)}
          label='Slug'
          name='slug'
          size='small'
          value={slug}
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
          size='small'
          value={content}
          onChange={e => onContentChange(e.target.value)}
        />
      </Stack>
    </Paper>
  );
};
