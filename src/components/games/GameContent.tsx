'use client';

import { Box, Chip, Stack, Typography, useTheme } from '@mui/material';

interface IGameContentProps {
  description?: string;
  variant?: 'outlined' | 'contained';
  platforms?: Array<{
    id: string;
    name: string;
    manufacturer: string;
  }>;
}

export const GameContent = ({
  description,
  variant = 'outlined',
  platforms = [],
}: IGameContentProps) => {
  const theme = useTheme();

  const containerStyles = {
    backgroundColor:
      variant === 'contained' ? theme.palette.background.paper : 'transparent',
    border:
      variant === 'outlined' ? `1px solid ${theme.palette.divider}` : 'none',
    borderRadius: 1,
    p: 4,
  };

  return (
    <Box sx={containerStyles}>
      <Stack spacing={3}>
        {/* Description */}
        {description && (
          <Typography
            component='div'
            sx={{ whiteSpace: 'pre-wrap' }}
            variant='body1'
          >
            {description}
          </Typography>
        )}

        {/* Platforms */}
        {platforms.length > 0 && (
          <Box>
            <Typography gutterBottom variant='h6'>
              Plateformes
            </Typography>
            <Stack direction='row' flexWrap='wrap' gap={1}>
              {platforms.map(platform => (
                <Chip
                  key={platform.id}
                  label={`${platform.name} (${platform.manufacturer})`}
                  size='medium'
                  variant='outlined'
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
