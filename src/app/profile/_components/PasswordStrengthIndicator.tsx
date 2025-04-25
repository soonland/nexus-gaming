import {
  Box,
  LinearProgress,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useMemo } from 'react';

interface IPasswordCriteria {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const PASSWORD_CRITERIA: IPasswordCriteria[] = [
  {
    id: 'length',
    label: 'Au moins 8 caractères',
    test: (password: string) => password.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Au moins 1 majuscule',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    label: 'Au moins 1 minuscule',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    label: 'Au moins 1 chiffre',
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    id: 'special',
    label: 'Au moins 1 caractère spécial',
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
];

interface IPasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({
  password,
}: IPasswordStrengthIndicatorProps) => {
  const theme = useTheme();

  const analysis = useMemo(() => {
    const validCriteria = PASSWORD_CRITERIA.filter(criteria =>
      criteria.test(password)
    );
    const failedCriteria = PASSWORD_CRITERIA.filter(
      criteria => !criteria.test(password)
    );

    const strength = (validCriteria.length / PASSWORD_CRITERIA.length) * 100;

    let color: string;
    let label: string;

    if (strength <= 25) {
      color = theme.palette.error.main;
      label = 'Très faible';
    } else if (strength <= 50) {
      color = theme.palette.warning.main;
      label = 'Faible';
    } else if (strength <= 75) {
      color = theme.palette.warning.light;
      label = 'Moyen';
    } else {
      color = theme.palette.success.main;
      label = 'Fort';
    }

    return {
      strength,
      color,
      label,
      failedCriteria,
    };
  }, [password, theme.palette]);

  if (!password) {
    return null;
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Stack alignItems='center' direction='row' spacing={1} sx={{ mb: 1 }}>
        <LinearProgress
          sx={{
            'flex': 1,
            'height': 8,
            'borderRadius': 4,
            'backgroundColor': theme => alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              backgroundColor: analysis.color,
              transition: 'transform 0.3s, background-color 0.3s',
            },
          }}
          value={analysis.strength}
          variant='determinate'
        />
        <Typography
          sx={{ color: analysis.color, fontWeight: 500 }}
          variant='caption'
        >
          {analysis.label}
        </Typography>
      </Stack>

      {analysis.failedCriteria.length > 0 && (
        <Stack spacing={0.5}>
          {analysis.failedCriteria.map(criteria => (
            <Typography
              key={criteria.id}
              color='text.secondary'
              sx={{ display: 'flex', alignItems: 'center' }}
              variant='caption'
            >
              • {criteria.label}
            </Typography>
          ))}
        </Stack>
      )}
    </Box>
  );
};
