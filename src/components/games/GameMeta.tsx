'use client';
import { Link, Stack, Typography, type StackProps } from '@mui/material';
import type { Company } from '@prisma/client';
import { FiUsers } from 'react-icons/fi';

import { DateDisplay } from '@/components/common/DateDisplay';
import dayjs from '@/lib/dayjs';

interface IGameMetaProps extends Omit<StackProps, 'children'> {
  developer: Pick<
    Company,
    'id' | 'name' | 'createdAt' | 'updatedAt' | 'isDeveloper' | 'isPublisher'
  >;
  publisher: Pick<
    Company,
    'id' | 'name' | 'createdAt' | 'updatedAt' | 'isDeveloper' | 'isPublisher'
  >;
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
          <Link href={`/companies/${developer.id}`}>{developer.name}</Link> /{' '}
          <Link href={`/companies/${publisher.id}`}>{publisher.name}</Link>
        </Typography>
      </Stack>
      {releaseDate && (
        <DateDisplay date={dayjs(releaseDate).toDate()} format='calendar' />
      )}
    </Stack>
  );
};
