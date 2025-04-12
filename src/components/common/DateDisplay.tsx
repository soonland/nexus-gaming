'use client'

import { Text, Tooltip } from '@chakra-ui/react'
import { formatters } from '@/lib/dayjs'

interface DateDisplayProps {
  date: Date | string
  format?: 'relative' | 'short' | 'long' | 'calendar'
  withTooltip?: boolean
  tooltipFormat?: 'relative' | 'short' | 'long' | 'calendar'
  customFormat?: string
  color?: string
}

export function DateDisplay({
  date,
  format = 'relative',
  withTooltip = true,
  tooltipFormat,
  customFormat,
  color = 'gray.500',
}: DateDisplayProps) {
  // Si un format personnalisé est fourni, l'utiliser
  const formattedDate = customFormat 
    ? formatters.custom(date, customFormat)
    : formatters[format](date)

  // Pour le tooltip, utiliser le format spécifié ou choisir un format complémentaire
  const tooltipDate = tooltipFormat 
    ? formatters[tooltipFormat](date)
    : format === 'relative' 
      ? formatters.calendar(date)
      : formatters.relative(date)

  const content = (
    <Text 
      as="time" 
      dateTime={formattedDate} 
      color={color} 
      fontSize="sm"
    >
      {formattedDate}
    </Text>
  )

  if (withTooltip) {
    return (
      <Tooltip 
        label={tooltipDate} 
        hasArrow 
        placement="top"
      >
        {content}
      </Tooltip>
    )
  }

  return content
}
