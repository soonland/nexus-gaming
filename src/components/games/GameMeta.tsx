'use client';

import { Stack, Typography, type StackProps } from '@mui/material';
import { FiUsers } from 'react-icons/fi';

import { DateDisplay } from '@/components/common/DateDisplay';

interface IGameMetaProps extends Omit<StackProps, 'children'> {
  developer: string;
  publisher: string;
  releaseDate?: string | Date;
  showIcon?: boolean;
  iconSize?: number;
}

export const GameMeta = ({
  developer,
  publisher,
  releaseDate,
  showIcon = true,
  iconSize = 16,
  ...stackProps
}: IGameMetaProps) => {
  return (
    <Stack alignItems='center' direction='row' spacing={3} {...stackProps}>
      <Stack alignItems='center' direction='row' spacing={1}>
        {showIcon && <FiUsers size={iconSize} />}
        <Typography variant='body2'>
          {developer} / {publisher}
        </Typography>
      </Stack>
      {releaseDate && (
        <DateDisplay
          date={
            typeof releaseDate === 'string'
              ? new Date(releaseDate)
              : releaseDate
          }
        />
      )}
    </Stack>
  );
};
