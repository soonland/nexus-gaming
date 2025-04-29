import { Box, Typography } from '@mui/material';

interface IFormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection = ({ title, children }: IFormSectionProps) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      gutterBottom
      color='text.secondary'
      sx={{
        fontWeight: 500,
        textTransform: 'uppercase',
        fontSize: '0.875rem',
        letterSpacing: '0.1px',
      }}
      variant='subtitle1'
    >
      {title}
    </Typography>
    {children}
  </Box>
);
