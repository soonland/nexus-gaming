'use client';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { ArticleStatus } from '@prisma/client';

import type { IArticleStatusSelectProps } from './types';

const ARTICLE_PUBLISH_STATUS: { value: ArticleStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PUBLISHED', label: 'Publié' },
  { value: 'ARCHIVED', label: 'Archivé' },
  { value: 'PENDING_APPROVAL', label: "En attente d'approbation" },
];

export const ArticleStatusSelect = ({
  status,
  onStatusChange,
}: IArticleStatusSelectProps) => {
  return (
    <FormControl required>
      <InputLabel id='status-label'>Statut</InputLabel>
      <Select
        required
        label='Statut'
        labelId='status-label'
        name='status'
        size='small'
        value={status}
        onChange={e => onStatusChange(e.target.value as ArticleStatus)}
      >
        {ARTICLE_PUBLISH_STATUS.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
