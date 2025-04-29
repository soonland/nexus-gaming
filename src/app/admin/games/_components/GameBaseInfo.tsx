import { Stack, Typography } from '@mui/material';

import { FieldBox } from '@/components/admin/common/FieldBox';
import { FormSection } from '@/components/admin/common/FormSection';
import dayjs from '@/lib/dayjs';
import type { IGameData } from '@/types/api';

interface IGameBaseInfoProps {
  game: IGameData;
}

export const GameBaseInfo = ({ game }: IGameBaseInfoProps) => {
  return (
    <Stack spacing={3}>
      {/* Description */}
      {game.description && (
        <FormSection title='Description'>
          <FieldBox>
            <Typography
              component='div'
              sx={{
                'whiteSpace': 'pre-wrap',
                'wordBreak': 'break-word',
                '& p': { mb: 2 },
                '& ul, & ol': { mb: 2, pl: 4 },
                '& li': { mb: 0.5 },
                '& a': {
                  'color': 'primary.main',
                  'textDecoration': 'none',
                  '&:hover': { textDecoration: 'underline' },
                },
              }}
            >
              {game.description}
            </Typography>
          </FieldBox>
        </FormSection>
      )}

      {/* Genre et Date de sortie sur la même ligne */}
      <Stack
        direction='row'
        spacing={3}
        sx={{ '& > *': { minWidth: '200px', flex: 1 } }}
      >
        {game.genre && (
          <FormSection title='Genre'>
            <FieldBox>
              <Typography>{game.genre}</Typography>
            </FieldBox>
          </FormSection>
        )}

        {game.releaseDate && (
          <FormSection title='Date de sortie'>
            <FieldBox>
              <Typography>{dayjs(game.releaseDate).format('LL')}</Typography>
            </FieldBox>
          </FormSection>
        )}
      </Stack>
    </Stack>
  );
};
