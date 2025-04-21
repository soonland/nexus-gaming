'use client';

import { Box, Typography } from '@mui/material';
import type { AnnouncementType } from '@prisma/client';

const TYPE_STYLES: Record<
  AnnouncementType,
  {
    label: string;
    color: string;
    backgroundColor: string;
  }
> = {
  INFO: {
    label: 'Information',
    color: 'rgb(30, 73, 118)',
    backgroundColor: 'rgb(229, 246, 253)',
  },
  ATTENTION: {
    label: 'Attention',
    color: 'rgb(102, 60, 0)',
    backgroundColor: 'rgb(255, 244, 229)',
  },
  URGENT: {
    label: 'Urgent',
    color: 'rgb(122, 12, 46)',
    backgroundColor: 'rgb(255, 231, 237)',
  },
};

interface IAnnouncementTypeBadgeProps {
  type: AnnouncementType;
}

export const AnnouncementTypeBadge = ({
  type,
}: IAnnouncementTypeBadgeProps) => {
  const styles = TYPE_STYLES[type];

  return (
    <Box
      sx={{
        'display': 'inline-flex',
        'alignItems': 'center',
        'py': 0.75,
        'px': 1.5,
        'borderLeftWidth': 4,
        'borderLeftStyle': 'solid',
        'borderColor': styles.color,
        'bgcolor': styles.backgroundColor,
        'borderRadius': '0 4px 4px 0',
        'transition': theme =>
          theme.transitions.create(['background-color', 'border-color'], {
            duration: theme.transitions.duration.shortest,
          }),
        '&:hover': {
          bgcolor: styles.backgroundColor,
          borderColor: styles.color,
        },
      }}
    >
      <Typography
        sx={{
          color: styles.color,
          fontWeight: 500,
        }}
        variant='body2'
      >
        {styles.label}
      </Typography>
    </Box>
  );
};
