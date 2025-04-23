import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { FiSend } from 'react-icons/fi';

interface ISubmitButtonProps {
  disabled?: boolean;
  onSubmit: (comment: string) => Promise<void>;
}

export const SubmitButton: React.FC<ISubmitButtonProps> = ({
  disabled,
  onSubmit,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(comment);
      setDialogOpen(false);
      setComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        color='primary'
        disabled={disabled}
        startIcon={<FiSend />}
        variant='contained'
        onClick={() => setDialogOpen(true)}
      >
        Soumettre
      </Button>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={dialogOpen}
        onClose={() => !isSubmitting && setDialogOpen(false)}
      >
        <DialogTitle>Soumettre l'article</DialogTitle>
        <DialogContent>
          <Typography color='text.secondary' sx={{ mb: 2 }} variant='body2'>
            Votre article sera soumis pour approbation. Un éditeur senior le
            révisera avant publication.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            disabled={isSubmitting}
            label='Commentaire (optionnel)'
            placeholder='Ajoutez des notes pour le relecteur...'
            rows={4}
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={isSubmitting} onClick={() => setDialogOpen(false)}>
            Annuler
          </Button>
          <Button
            disabled={isSubmitting}
            startIcon={<FiSend />}
            variant='contained'
            onClick={handleSubmit}
          >
            Soumettre
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
