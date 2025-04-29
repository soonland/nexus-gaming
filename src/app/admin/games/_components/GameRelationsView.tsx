import { Box, Stack, Typography } from '@mui/material';
import { FiBox, FiMonitor } from 'react-icons/fi';

import { PlatformChip } from '@/components/common/PlatformChip';
import type { IGameData } from '@/types/api';

interface IGameRelationsViewProps {
  game: IGameData;
}

export const GameRelationsView = ({ game }: IGameRelationsViewProps) => {
  return (
    <Stack spacing={4}>
      {/* Relations avec les compagnies */}
      <Box>
        <Stack alignItems='center' direction='row' spacing={1}>
          <FiBox size={20} />
          <Typography variant='h6'>Relations compagnies</Typography>
        </Stack>
        <Stack
          spacing={3}
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Stack direction='row' spacing={3} sx={{ '& > *': { flex: 1 } }}>
            <Stack spacing={1}>
              <Typography color='text.secondary' variant='subtitle2'>
                Développeur
              </Typography>
              <Typography variant='subtitle1'>{game.developer.name}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography color='text.secondary' variant='subtitle2'>
                Éditeur
              </Typography>
              <Typography variant='subtitle1'>{game.publisher.name}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Relations avec les plateformes */}
      <Box>
        <Stack alignItems='center' direction='row' spacing={1}>
          <FiMonitor size={20} />
          <Typography variant='h6'>Relations plateformes</Typography>
        </Stack>
        <Stack
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Stack direction='row' sx={{ flexWrap: 'wrap', gap: 1 }}>
            {game.platforms.map(platform => (
              <PlatformChip key={platform.id} platform={platform} />
            ))}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};
