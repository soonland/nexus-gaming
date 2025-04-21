'use client';

import {
  Autocomplete,
  Box,
  FormControl,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import type { GameGenre } from '@/types/api';

import { CompanyOption } from '../CompanyOption';
import { GameHeroImage } from './GameHeroImage';
import type { IGameMetadataPanelProps } from './types';

export const GameMetadataPanel = ({
  isOpen,
  developerId,
  publisherId,
  releaseDate,
  coverImage,
  isUploading,
  developerError,
  publisherError,
  developers,
  publishers,
  platforms,
  platformIds,
  onDeveloperChange,
  onImageChange,
  onPlatformsChange,
  onPublisherChange,
  onQuickCompanyCreate,
  onReleaseDateChange,
  genre,
  onGenreChange,
}: IGameMetadataPanelProps) => {
  const genreLabels: Record<GameGenre, string> = {
    RPG: 'Jeu de rôle',
    ACTION: 'Action',
    ADVENTURE: 'Aventure',
    SPORTS: 'Sports',
    RACING: 'Course',
    STRATEGY: 'Stratégie',
    SHOOTER: 'Tir',
    PUZZLE: 'Puzzle',
    SIMULATION: 'Simulation',
    FIGHTING: 'Combat',
  };

  const genreOptions: GameGenre[] = [
    'RPG',
    'ACTION',
    'ADVENTURE',
    'SPORTS',
    'RACING',
    'STRATEGY',
    'SHOOTER',
    'PUZZLE',
    'SIMULATION',
    'FIGHTING',
  ];
  return (
    <Paper
      elevation={4}
      sx={{
        height: '100%',
        width: isOpen ? 350 : 0,
        transform: `translateX(${isOpen ? '0' : '100%'})`,
        transition: 'transform 0.3s ease-in-out',
        position: 'relative',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          'flex': 1,
          'overflowY': 'auto',
          'p': 3,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.05)',
          },
        }}
      >
        <Box
          sx={{
            pb: 2,
            mb: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography sx={{ fontWeight: 500 }} variant='h6'>
            Métadonnées
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          {/* Genre */}
          <Autocomplete
            fullWidth
            getOptionLabel={option => genreLabels[option]}
            options={genreOptions}
            renderInput={params => <TextField {...params} label='Genre' />}
            size='small'
            value={genre}
            onChange={(_, value) => onGenreChange(value as GameGenre | null)}
          />

          {/* Platefomes */}
          <Autocomplete
            disableCloseOnSelect
            fullWidth
            multiple
            getOptionLabel={option => option.name}
            options={platforms}
            renderInput={params => (
              <TextField {...params} label='Plateformes' />
            )}
            size='small'
            value={platforms.filter(p => platformIds.includes(p.id))}
            onChange={(_, value) => {
              onPlatformsChange(value.map(v => v.id));
            }}
          />

          {/* Image de couverture */}
          <GameHeroImage
            coverImage={coverImage}
            isUploading={isUploading}
            onImageChange={onImageChange}
          />

          {/* Développeur */}
          <Autocomplete
            fullWidth
            getOptionLabel={option =>
              option.id === 'create-new'
                ? '+ Créer un développeur'
                : option.name
            }
            options={[{ id: 'create-new', name: '' } as any, ...developers]}
            renderInput={params => (
              <TextField
                {...params}
                required
                error={!!developerError}
                helperText={developerError}
                label='Développeur'
              />
            )}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <CompanyOption
                  key={key}
                  {...otherProps}
                  option={option}
                  role='developer'
                />
              );
            }}
            size='small'
            value={developers.find(d => d.id === developerId) || null}
            onChange={(_, value) => {
              if (value?.id === 'create-new') {
                onQuickCompanyCreate('developer');
                return;
              }
              onDeveloperChange(value?.id || '');
            }}
          />

          {/* Éditeur */}
          <Autocomplete
            fullWidth
            getOptionLabel={option =>
              option.id === 'create-new' ? '+ Créer un éditeur' : option.name
            }
            options={[{ id: 'create-new', name: '' } as any, ...publishers]}
            renderInput={params => (
              <TextField
                {...params}
                required
                error={!!publisherError}
                helperText={publisherError}
                label='Éditeur'
              />
            )}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <CompanyOption
                  key={key}
                  {...otherProps}
                  option={option}
                  role='publisher'
                />
              );
            }}
            size='small'
            value={publishers.find(p => p.id === publisherId) || null}
            onChange={(_, value) => {
              if (value?.id === 'create-new') {
                onQuickCompanyCreate('publisher');
                return;
              }
              onPublisherChange(value?.id || '');
            }}
          />

          {/* Date de sortie */}
          <FormControl size='small'>
            <DatePicker
              label='Date de sortie'
              value={releaseDate}
              onChange={date => onReleaseDateChange(date)}
            />
          </FormControl>
        </Stack>
      </Box>
    </Paper>
  );
};
