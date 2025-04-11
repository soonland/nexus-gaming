'use client'

import { forwardRef, useEffect, useState } from 'react'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import { fr } from 'date-fns/locale'
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Box,
  HStack,
} from '@chakra-ui/react'
import { CalendarIcon, CloseIcon } from '@chakra-ui/icons'
import "react-datepicker/dist/react-datepicker.css"

// Enregistrer la locale française
registerLocale('fr', fr)

interface ChakraDateTimePickerProps {
  selectedDate: Date | null
  onChange: (date: Date | null) => void
  showTimeSelect?: boolean
  minDate?: Date
  placeholderText?: string
  isClearable?: boolean
}

// Composant Input customisé pour react-datepicker
const CustomInput = forwardRef<HTMLInputElement, any>(({ value, onClick, onChange, placeholder, onClear }, ref) => (
  <HStack spacing={2}>
    <InputGroup>
      <Input
        ref={ref}
        value={value}
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholder}
        readOnly
        pr="3rem"
      />
      <InputRightElement>
        <IconButton
          aria-label="Ouvrir le calendrier"
          icon={<CalendarIcon />}
          variant="ghost"
          onClick={onClick}
          size="sm"
        />
      </InputRightElement>
    </InputGroup>
    {value && (
      <IconButton
        aria-label="Effacer la date"
        icon={<CloseIcon />}
        variant="ghost"
        colorScheme="red"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          onClear()
        }}
      />
    )}
  </HStack>
))

CustomInput.displayName = 'CustomInput'

export function ChakraDateTimePicker({
  selectedDate,
  onChange,
  showTimeSelect = true,
  minDate = new Date(),
  placeholderText,
  isClearable = true,
}: ChakraDateTimePickerProps) {
  const [mounted, setMounted] = useState(false)
  
  // Fix pour l'hydration côté client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Styles pour le thème clair/sombre
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBgColor = useColorModeValue('blue.50', 'blue.800')
  const selectedBgColor = useColorModeValue('blue.500', 'blue.400')
  const headerBgColor = useColorModeValue('gray.50', 'gray.700')

  if (!mounted) {
    return null
  }

  return (
    <Box
      sx={{
        // Base styles
        '.react-datepicker': {
          backgroundColor: bgColor,
          color: textColor,
          border: '1px solid',
          borderColor: borderColor,
          fontFamily: 'inherit',
        },
        '.react-datepicker__header': {
          backgroundColor: headerBgColor,
          borderBottom: '1px solid',
          borderColor: borderColor,
          color: textColor,
        },
        '.react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker-time__header': {
          color: textColor,
        },
        '.react-datepicker__day': {
          color: textColor,
        },
        // Hover states
        '.react-datepicker__time-container .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover': {
          backgroundColor: hoverBgColor,
        },
        '.react-datepicker__day:hover': {
          backgroundColor: hoverBgColor,
        },
        
        // Selected states
        '.react-datepicker__day--selected, .react-datepicker__day--keyboard-selected': {
          backgroundColor: selectedBgColor,
          color: 'white',
          '&:hover': {
            backgroundColor: selectedBgColor,
          },
        },
        
        // Time container
        '.react-datepicker__time-container': {
          borderLeft: '1px solid',
          borderColor: borderColor,
        },
        '.react-datepicker__time': {
          backgroundColor: bgColor,
        },
        '.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item': {
          color: textColor,
          '&:hover': {
            backgroundColor: hoverBgColor,
          },
        },
        '.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected': {
          backgroundColor: selectedBgColor,
          color: 'white',
          '&:hover': {
            backgroundColor: selectedBgColor,
          },
        },
        '.react-datepicker__input-container input': {
          width: '100%',
        },
      }}
    >
      <ReactDatePicker
        selected={selectedDate}
        onChange={onChange}
        showTimeSelect={showTimeSelect}
        minDate={minDate}
        placeholderText={placeholderText || (showTimeSelect ? "Sélectionner une date et heure" : "Sélectionner une date")}
        isClearable={false}
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat={showTimeSelect ? "Pp" : "PP"}
        locale="fr"
        timeCaption="Heure"
        customInput={<CustomInput 
          placeholder={placeholderText || (showTimeSelect ? "Sélectionner une date et heure" : "Sélectionner une date")}
          onClear={() => onChange(null)} 
        />}
        popperProps={{
          strategy: 'fixed',
        }}
      />
    </Box>
  )
}
