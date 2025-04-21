import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { FiExternalLink, FiX } from 'react-icons/fi';

import { generateSocialUrl, socialPlaceholders } from '@/lib/social';

import { socialIcons } from './constants';
import type { ISocialProfileFieldProps } from './types';

export const SocialProfileField = ({
  platform,
  state,
  onChange,
  onClear,
}: ISocialProfileFieldProps) => {
  const Icon = socialIcons[platform];
  const generatedUrl = state.value
    ? generateSocialUrl(platform, state.value)
    : null;

  const handleOpenUrl = () => {
    if (generatedUrl) {
      window.open(generatedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Stack
      alignItems='center'
      direction='row'
      spacing={2}
      sx={{
        '& .MuiInputBase-root': {
          ...(state.isDirty && {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          }),
        },
      }}
    >
      <TextField
        fullWidth
        placeholder={socialPlaceholders[platform]}
        size='small'
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <Icon size={20} />
              </InputAdornment>
            ),
            endAdornment: state.value ? (
              <InputAdornment position='end'>
                {!state.isDirty && generatedUrl && (
                  <Tooltip title='Ouvrir le profil'>
                    <IconButton
                      aria-label='Ouvrir le profil'
                      size='small'
                      onClick={handleOpenUrl}
                    >
                      <FiExternalLink />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title='Effacer'>
                  <IconButton
                    aria-label='Effacer'
                    size='small'
                    onClick={onClear}
                  >
                    <FiX />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : null,
          },
        }}
        value={state.value}
        onChange={e => onChange(e.target.value)}
      />
    </Stack>
  );
};
