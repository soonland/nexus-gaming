'use client';

import { Typography, Tooltip, Stack } from '@mui/material';
import { FiCalendar } from 'react-icons/fi';

import { formatters } from '@/lib/dayjs';

interface IDateDisplayProps {
  date: Date | string;
  format?: 'relative' | 'short' | 'long' | 'calendar';
  withTooltip?: boolean;
  tooltipFormat?: 'relative' | 'short' | 'long' | 'calendar';
  customFormat?: string;
  color?: string;
  sx?: React.CSSProperties;
}

export const DateDisplay = ({
  date,
  format = 'relative',
  withTooltip = true,
  tooltipFormat,
  customFormat,
  color = 'inherit',
  sx,
}: IDateDisplayProps) => {
  // Si un format personnalisé est fourni, l'utiliser
  const formattedDate = customFormat
    ? formatters.custom(date, customFormat)
    : formatters[format](date);

  // Pour le tooltip, utiliser le format spécifié ou choisir un format complémentaire
  const tooltipDate = tooltipFormat
    ? formatters[tooltipFormat](date)
    : format === 'relative'
      ? formatters.calendar(date)
      : formatters.relative(date);

  const content = (
    <Stack alignItems='center' direction='row' spacing={1}>
      <FiCalendar />
      <Typography
        color={color}
        component='time'
        dateTime={formattedDate}
        sx={sx}
        variant='body2'
      >
        {formattedDate}
      </Typography>
    </Stack>
  );

  if (withTooltip) {
    return (
      <Tooltip arrow placement='top' title={tooltipDate}>
        {content}
      </Tooltip>
    );
  }

  return content;
};
