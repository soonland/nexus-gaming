import { Box, Stack, Typography } from '@mui/material';

import { FieldBox } from '@/components/admin/common/FieldBox';
import { FormSection } from '@/components/admin/common/FormSection';
import type { IGameData } from '@/types/api';

interface IGameMediaViewProps {
  game: IGameData;
}

export const GameMediaView = ({ game }: IGameMediaViewProps) => {
  return (
    <Stack spacing={3}>
      {/* Image de couverture */}
      <FormSection title='Image de couverture'>
        <FieldBox>
          <Stack spacing={2}>
            {game.coverImage ? (
              <>
                <Box
                  sx={{
                    width: '300px',
                    height: '169px', // 16:9 ratio
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 1,
                  }}
                >
                  <Box
                    alt={game.title}
                    component='img'
                    src={game.coverImage}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <Box>
                  <Typography color='text.secondary' variant='caption'>
                    Dimensions recommandées : 1920x1080px (16:9)
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography color='text.secondary' variant='body1'>
                Aucune image de couverture
              </Typography>
            )}
          </Stack>
        </FieldBox>
      </FormSection>
    </Stack>
  );
};
