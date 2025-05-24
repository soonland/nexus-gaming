'use client';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { ArticleStatus } from '@prisma/client';
import { useState } from 'react';

import { StatusTransitionDialog } from '../StatusTransitionDialog';
import type { IArticleStatusSelectProps } from './types';

const ARTICLE_PUBLISH_STATUS: { value: ArticleStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PUBLISHED', label: 'Publié' },
  { value: 'ARCHIVED', label: 'Archivé' },
  { value: 'PENDING_APPROVAL', label: "En attente d'approbation" },
  { value: 'NEEDS_CHANGES', label: 'À réviser' },
];

/**
 * Component for senior editors and above to manage article status.
 * Regular editors use the SubmitButton component instead.
 */
export const ArticleStatusSelect = ({
  article,
  onStatusChange,
}: IArticleStatusSelectProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ArticleStatus | null>(null);
  const availableTransitions = ARTICLE_PUBLISH_STATUS;

  const handleStatusSelect = (newStatus: ArticleStatus) => {
    setTargetStatus(newStatus);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTargetStatus(null);
  };

  const handleTransition = async (status: ArticleStatus, comment: string) => {
    await onStatusChange(status, comment);
    setDialogOpen(false);
    setTargetStatus(null);
  };

  return (
    <>
      <FormControl required size='small'>
        <InputLabel id='status-label'>Statut</InputLabel>
        <Select
          required
          label='Statut'
          labelId='status-label'
          name='status'
          size='small'
          value={article.status}
          onChange={e => handleStatusSelect(e.target.value as ArticleStatus)}
        >
          {availableTransitions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {dialogOpen && targetStatus && (
        <StatusTransitionDialog
          article={article}
          open={dialogOpen}
          targetStatus={targetStatus}
          onClose={handleDialogClose}
          onTransition={handleTransition}
        />
      )}
    </>
  );
};
