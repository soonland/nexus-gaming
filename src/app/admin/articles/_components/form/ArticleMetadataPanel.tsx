'use client';

import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Role } from '@prisma/client';

import { ArticleGamesSelect } from './ArticleGamesSelect';
import { ArticleHeroImage } from './ArticleHeroImage';
import { ArticleStatusSelect } from './ArticleStatusSelect';
import { ArticleRevisionHistory } from '../ArticleRevisionHistory';
import type { IArticleMetadataPanelProps } from './types';

export const ArticleMetadataPanel = ({
  approvalHistory,
  canSelectArticleAuthor,
  categories,
  categoryError,
  categoryId,
  gameIds,
  games,
  heroImage,
  isLoading,
  isOpen,
  isUploading,
  publishedAt,
  status,
  updatedAt,
  userId,
  userRole,
  users,
  onCategoryChange,
  onGamesChange,
  onImageChange,
  onPublishedAtChange,
  onStatusChange,
  onUpdatedAtChange,
  onUserChange,
}: IArticleMetadataPanelProps) => {
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
        <Box sx={{ pb: 2, mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography sx={{ fontWeight: 500 }} variant='h6'>
            Métadonnées
          </Typography>
        </Box>

        <Stack spacing={2.5} sx={{ transition: 'opacity 0.2s ease-in-out' }}>
          {/* 1. Statut */}
          {!isLoading && userRole !== Role.EDITOR && (
            <ArticleStatusSelect
              article={{
                id: userId,
                title: '',
                content: '',
                status,
                heroImage: heroImage || undefined,
                publishedAt: publishedAt?.toISOString(),
                category: {
                  id: categoryId,
                  name: categories.find(c => c.id === categoryId)?.name || '',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                user: {
                  id: userId,
                  username: users?.find(u => u.id === userId)?.username || '',
                  role: userRole || 'USER',
                },
                games,
                createdAt: new Date().toISOString(),
                updatedAt: updatedAt?.toISOString() || new Date().toISOString(),
              }}
              userRole={userRole}
              onStatusChange={onStatusChange}
            />
          )}

          {/* 2. Catégorie */}
          <FormControl required error={!!categoryError} size='small'>
            <InputLabel id='category-label'>Catégorie</InputLabel>
            <Select
              label='Catégorie'
              labelId='category-label'
              name='categoryId'
              size='small'
              value={categoryId}
              onChange={e => onCategoryChange(e.target.value)}
            >
              <MenuItem value=''>
                <em>Sélectionner une catégorie</em>
              </MenuItem>
              {categories?.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {categoryError && (
              <FormHelperText error>{categoryError}</FormHelperText>
            )}
          </FormControl>

          {/* 3. Auteur */}
          <FormControl size='small'>
            <InputLabel id='user-label'>Auteur</InputLabel>
            <Select
              disabled={!canSelectArticleAuthor}
              label='Auteur'
              labelId='user-label'
              name='userId'
              value={userId}
              onChange={e => onUserChange(e.target.value)}
            >
              <MenuItem value=''>
                <em>Sélectionner un auteur</em>
              </MenuItem>
              {users?.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 4. Date de publication */}
          <FormControl size='small'>
            <DateTimePicker
              label='Date de publication'
              value={publishedAt}
              onChange={date => onPublishedAtChange(date)}
            />
          </FormControl>

          {/* 5. Date de mise à jour */}
          <FormControl size='small'>
            <DateTimePicker
              label='Date de mise à jour'
              value={updatedAt}
              onChange={date => onUpdatedAtChange(date)}
            />
          </FormControl>

          {/* 6. Hero Image */}
          <ArticleHeroImage
            heroImage={heroImage}
            isUploading={isUploading}
            onImageChange={onImageChange}
          />

          {/* 7. Jeux associés */}
          <ArticleGamesSelect
            gameIds={gameIds}
            games={games}
            onGamesChange={onGamesChange}
          />

          {/* 8. Historique des révisions */}
          {approvalHistory && approvalHistory.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <ArticleRevisionHistory history={approvalHistory} />
            </>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};
