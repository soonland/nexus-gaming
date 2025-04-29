import { Box } from '@mui/material';

interface IFieldBoxProps {
  children: React.ReactNode;
}

export const FieldBox = ({ children }: IFieldBoxProps) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 1,
      bgcolor: 'background.paper',
      border: 1,
      borderColor: 'divider',
    }}
  >
    {children}
  </Box>
);
