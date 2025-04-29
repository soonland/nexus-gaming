import {
  Box,
  Stack,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { FiCopy, FiCheck, FiX } from 'react-icons/fi';

import dayjs from '@/lib/dayjs';
import type { IGameData } from '@/types/api';

const fieldLabels: Record<string, string> = {
  // Champs requis
  title: 'Titre',
  developerId: 'Développeur',
  publisherId: 'Éditeur',

  // Champs optionnels
  description: 'Description',
  coverImage: 'Image de couverture',
  releaseDate: 'Date de sortie',
  genre: 'Genre',
};

const getFieldValue = (game: IGameData, field: string) => {
  switch (field) {
    case 'developerId':
      return game.developer?.id;
    case 'publisherId':
      return game.publisher?.id;
    default:
      return game[field as keyof IGameData];
  }
};

interface IGameTechnicalViewProps {
  game: IGameData;
}

export const GameTechnicalView = ({ game }: IGameTechnicalViewProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const requiredFields = ['title', 'developerId', 'publisherId'];
  const optionalFields = ['description', 'coverImage', 'releaseDate', 'genre'];

  const completedOptionalFields = optionalFields.filter(
    field => game[field as keyof IGameData] != null
  );
  const completionScore =
    (completedOptionalFields.length / optionalFields.length) * 100;

  const CopyButton = ({ value, field }: { value: string; field: string }) => (
    <Tooltip title='Copier'>
      <IconButton
        color={copiedField === field ? 'success' : 'default'}
        size='small'
        onClick={() => handleCopy(value, field)}
      >
        {copiedField === field ? <FiCheck size={16} /> : <FiCopy size={16} />}
      </IconButton>
    </Tooltip>
  );

  const DataField = ({
    label,
    value,
    showCopy = true,
  }: {
    label: string;
    value: string;
    showCopy?: boolean;
  }) => (
    <Stack alignItems='center' direction='row' spacing={1}>
      <Typography color='text.secondary' variant='subtitle2'>
        {label}:
      </Typography>
      <Typography sx={{ fontFamily: 'monospace' }} variant='subtitle2'>
        {value}
      </Typography>
      {showCopy && <CopyButton field={label} value={value} />}
    </Stack>
  );

  const FieldStatus = ({ field }: { field: string }) => {
    const value = getFieldValue(game, field);
    const label = fieldLabels[field] || field;
    return (
      <Stack alignItems='center' direction='row' spacing={1}>
        <Typography variant='subtitle2'>{label}</Typography>
        <Tooltip title={value ? 'Champ rempli' : 'Champ vide'}>
          {value ? (
            <FiCheck color='#2e7d32' size={16} />
          ) : (
            <FiX color='#d32f2f' size={16} />
          )}
        </Tooltip>
      </Stack>
    );
  };

  return (
    <Stack spacing={4}>
      {/* Identifiants */}
      <Box>
        <Typography gutterBottom variant='h6'>
          Identifiants
        </Typography>
        <Stack
          spacing={2}
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <DataField label='ID du jeu' value={game.id} />
          <DataField label='ID du développeur' value={game.developer.id} />
          <DataField label={`ID de l'éditeur`} value={game.publisher.id} />
          <Stack alignItems='center' direction='row' spacing={1}>
            <Typography color='text.secondary' variant='subtitle2'>
              IDs des plateformes:
            </Typography>
            <Stack direction='row' flexWrap='wrap' spacing={1}>
              {game.platforms.map(platform => (
                <Chip
                  key={platform.id}
                  label={platform.id}
                  size='small'
                  sx={{ fontFamily: 'monospace' }}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Horodatages */}
      <Box>
        <Typography gutterBottom variant='h6'>
          Horodatages
        </Typography>
        <Stack
          spacing={2}
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Stack spacing={1}>
            <DataField
              label='Créé le'
              showCopy={false}
              value={dayjs(game.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            />
          </Stack>
          <Stack spacing={1}>
            <DataField
              label='Mis à jour le'
              showCopy={false}
              value={dayjs(game.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Complétude des données */}
      <Box>
        <Typography gutterBottom variant='h6'>
          Complétude des données
        </Typography>
        <Stack
          spacing={3}
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography gutterBottom color='text.secondary' variant='subtitle2'>
              Score de complétion des champs optionnels
            </Typography>
            <Typography variant='h4'>{Math.round(completionScore)}%</Typography>
            <Typography color='text.secondary' variant='caption'>
              {completedOptionalFields.length} sur {optionalFields.length}{' '}
              champs remplis
            </Typography>
          </Box>

          <Box>
            <Typography gutterBottom variant='subtitle2'>
              Champs requis
            </Typography>
            <Stack direction='row' flexWrap='wrap' spacing={2}>
              {requiredFields.map(field => (
                <FieldStatus key={field} field={field} />
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography gutterBottom variant='subtitle2'>
              Champs optionnels
            </Typography>
            <Stack direction='row' flexWrap='wrap' spacing={2}>
              {optionalFields.map(field => (
                <FieldStatus key={field} field={field} />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};
