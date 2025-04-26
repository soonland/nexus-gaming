'use client';

import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  useTheme,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type React from 'react';

export interface IBadge {
  id?: string;
  label?: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export interface IHeroProps {
  title: string;
  image?: string;
  badges?: IBadge[];
  metadata?: React.ReactNode;
  minHeight?: string | { [key: string]: string };
  overlay?: boolean;
  overlayStrength?: number;
  sx?: SxProps<Theme>;
}

export const Hero = ({
  title,
  image,
  badges = [],
  metadata,
  minHeight = { xs: '300px', md: '400px' },
  overlay = true,
  overlayStrength = 0.6,
  sx,
}: IHeroProps) => {
  const theme = useTheme();

  return (
    <Box mb={2} sx={sx}>
      <Container maxWidth='lg'>
        <Box
          sx={{
            position: 'relative',
            minHeight: minHeight,
            overflow: 'hidden',
            borderRadius: 1,
          }}
        >
          {/* Overlay gradient */}
          {overlay && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(to top, rgba(0,0,0,${overlayStrength}), rgba(0,0,0,${
                  overlayStrength * 0.5
                }))`,
                zIndex: 1,
              }}
            />
          )}

          {/* Background image */}
          <Box
            alt={title}
            component='img'
            src={image || '/images/placeholder-game.png'}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Content */}
          <Stack
            spacing={2}
            sx={{
              position: 'absolute',
              bottom: theme.spacing(4),
              left: theme.spacing(4),
              right: theme.spacing(4),
              color: 'common.white',
              zIndex: 2,
            }}
          >
            {badges?.length > 0 && (
              <Stack direction='row' flexWrap='wrap' gap={1} spacing={1}>
                {badges.map(badge => (
                  <Chip
                    key={badge.id}
                    color={badge.color || 'primary'}
                    label={badge.label}
                    size='small'
                    sx={{
                      'color': 'common.white',
                      '& .MuiChip-label': {
                        color: 'common.white',
                      },
                    }}
                  />
                ))}
              </Stack>
            )}

            <Typography component='h1' variant='h2'>
              {title}
            </Typography>

            {metadata && <Box>{metadata}</Box>}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
