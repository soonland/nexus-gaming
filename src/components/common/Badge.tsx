import { Box, type BoxProps } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface IBadgeProps extends Omit<BoxProps, 'color'> {
  color: string;
  children: React.ReactNode;
}

export const Badge = ({ color, children, ...props }: IBadgeProps) => (
  <Box
    {...props}
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      px: 1,
      py: 0.5,
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 600,
      color: color,
      bgcolor: theme => alpha(color, theme.palette.mode === 'dark' ? 0.2 : 0.1),
      ...props.sx,
    }}
  >
    {children}
  </Box>
);
