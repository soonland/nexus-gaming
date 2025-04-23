import { Button } from '@mui/material';
import { useState } from 'react';
import { FiSave } from 'react-icons/fi';

interface IDraftButtonProps {
  disabled?: boolean;
  onSubmit: () => Promise<void>;
}

export const DraftButton: React.FC<IDraftButtonProps> = ({
  disabled,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      color='secondary'
      disabled={disabled || isSubmitting}
      startIcon={<FiSave />}
      variant='outlined'
      onClick={handleSubmit}
    >
      Sauvegarder
    </Button>
  );
};
