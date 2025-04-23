import { Button } from '@mui/material';
import { useState } from 'react';
import { FiSave } from 'react-icons/fi';

interface IDraftButtonProps {
  disabled?: boolean;
  onSubmit?: () => Promise<void>;
  label?: string;
  color?: 'inherit' | 'primary' | 'secondary' | 'success';
  value?: string;
  type?: 'submit' | 'button';
}

export const DraftButton: React.FC<IDraftButtonProps> = ({
  disabled,
  onSubmit,
  label = 'Sauvegarder',
  color = 'secondary',
  value,
  type = 'button',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      color={color}
      disabled={disabled || isSubmitting}
      startIcon={<FiSave />}
      type={type}
      value={value}
      variant='outlined'
      onClick={type === 'button' ? handleClick : undefined}
    >
      {isSubmitting ? 'Enregistrement...' : label}
    </Button>
  );
};
