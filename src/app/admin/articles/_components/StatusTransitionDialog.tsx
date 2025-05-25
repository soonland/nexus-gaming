import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import type { ArticleStatus } from '@prisma/client';
import { useState } from 'react';

import type { IArticleData } from '@/types/api';

const getStatusLabel = (status: ArticleStatus): string => {
  const labels: Record<ArticleStatus, string> = {
    DRAFT: 'Brouillon',
    PUBLISHED: 'Publié',
    ARCHIVED: 'Archivé',
    PENDING_APPROVAL: "En attente d'approbation",
    NEEDS_CHANGES: 'À réviser',
    DELETED: 'Supprimé',
  };
  return labels[status] || status;
};

const isCommentRequired = (targetStatus: ArticleStatus): boolean => {
  return targetStatus === 'NEEDS_CHANGES';
};

interface IStatusTransitionDialogProps {
  article: IArticleData;
  targetStatus: ArticleStatus;
  open: boolean;
  onClose: () => void;
  onTransition: (status: ArticleStatus, comment: string) => Promise<void>;
}

export const StatusTransitionDialog: React.FC<IStatusTransitionDialogProps> = ({
  article,
  targetStatus,
  open,
  onClose,
  onTransition,
}) => {
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setErrors([]);

    // Validate comment if required
    if (isCommentRequired(targetStatus) && !comment.trim()) {
      setErrors(['Un commentaire est requis pour demander des modifications']);
      return;
    }

    try {
      setIsSubmitting(true);
      await onTransition(targetStatus, comment);
      setComment('');
      onClose();
    } catch (error) {
      setErrors([
        error instanceof Error
          ? error.message
          : 'Échec de la mise à jour du statut',
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
      <DialogTitle>Changer le statut</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 1 }}>
          {/* Status Change Display */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography color='text.secondary' variant='body2'>
              Statut actuel
            </Typography>
            <Typography fontWeight='medium' variant='body1'>
              {getStatusLabel(article.status)}
            </Typography>

            <Typography color='text.secondary' sx={{ mt: 1 }} variant='body2'>
              Nouveau statut
            </Typography>
            <Typography color='primary' fontWeight='medium' variant='body1'>
              {getStatusLabel(targetStatus)}
            </Typography>
          </Box>

          {/* Comment Field */}
          <TextField
            multiline
            disabled={isSubmitting}
            helperText={
              isCommentRequired(targetStatus)
                ? 'Un commentaire est requis pour demander des modifications'
                : 'Commentaire optionnel'
            }
            label='Commentaire'
            required={isCommentRequired(targetStatus)}
            rows={4}
            size='small'
            value={comment}
            onChange={e => setComment(e.target.value)}
          />

          {/* Validation Errors */}
          {errors.length > 0 && (
            <Alert severity='error'>
              <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                {errors.map(error => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={isSubmitting} onClick={onClose}>
          Annuler
        </Button>
        <Button
          disabled={isSubmitting}
          variant='contained'
          onClick={handleSubmit}
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
