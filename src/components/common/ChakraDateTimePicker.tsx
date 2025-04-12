'use client';

import { CalendarIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Box,
  HStack,
} from '@chakra-ui/react';
import { fr } from 'date-fns/locale';
import { forwardRef, useEffect, useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Enregistrer la locale française
registerLocale('fr', fr);

interface IChakraDateTimePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  showTimeSelect?: boolean;
  minDate?: Date;
  placeholderText?: string;
  isClearable?: boolean;
}

// Composant Input customisé pour react-datepicker
const CustomInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, onChange, placeholder, onClear }, ref) => (
    <HStack spacing={2}>
      <InputGroup>
        <Input
          ref={ref}
          readOnly
          placeholder={placeholder}
          pr='3rem'
          value={value}
          onChange={onChange}
          onClick={onClick}
        />
        <InputRightElement>
          <IconButton
            aria-label='Ouvrir le calendrier'
            icon={<CalendarIcon />}
            size='sm'
            variant='ghost'
            onClick={onClick}
          />
        </InputRightElement>
      </InputGroup>
      {value && (
        <IconButton
          aria-label='Effacer la date'
          colorScheme='red'
          icon={<CloseIcon />}
          size='sm'
          variant='ghost'
          onClick={e => {
            e.stopPropagation();
            onClear();
          }}
        />
      )}
    </HStack>
  )
);

CustomInput.displayName = 'CustomInput';

export const ChakraDateTimePicker = ({
  selectedDate,
  onChange,
  showTimeSelect = true,
  minDate = new Date(),
  placeholderText,
}: IChakraDateTimePickerProps) => {
  const [mounted, setMounted] = useState(false);

  // Fix pour l'hydration côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Styles pour le thème clair/sombre
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBgColor = useColorModeValue('blue.50', 'blue.800');
  const selectedBgColor = useColorModeValue('blue.500', 'blue.400');
  const headerBgColor = useColorModeValue('gray.50', 'gray.700');

  if (!mounted) {
    return null;
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
        '.react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker-time__header':
          {
            color: textColor,
          },
        '.react-datepicker__day': {
          color: textColor,
        },
        // Hover states
        '.react-datepicker__time-container .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover':
          {
            backgroundColor: hoverBgColor,
          },
        '.react-datepicker__day:hover': {
          backgroundColor: hoverBgColor,
        },

        // Selected states
        '.react-datepicker__day--selected, .react-datepicker__day--keyboard-selected':
          {
            'backgroundColor': selectedBgColor,
            'color': 'white',
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
        '.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item':
          {
            'color': textColor,
            '&:hover': {
              backgroundColor: hoverBgColor,
            },
          },
        '.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected':
          {
            'backgroundColor': selectedBgColor,
            'color': 'white',
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
        customInput={
          <CustomInput
            placeholder={
              placeholderText ||
              (showTimeSelect
                ? 'Sélectionner une date et heure'
                : 'Sélectionner une date')
            }
            onClear={() => onChange(null)}
          />
        }
        dateFormat={showTimeSelect ? 'Pp' : 'PP'}
        isClearable={false}
        locale='fr'
        minDate={minDate}
        placeholderText={
          placeholderText ||
          (showTimeSelect
            ? 'Sélectionner une date et heure'
            : 'Sélectionner une date')
        }
        popperProps={{
          strategy: 'fixed',
        }}
        selected={selectedDate}
        showTimeSelect={showTimeSelect}
        timeCaption='Heure'
        timeFormat='HH:mm'
        timeIntervals={15}
        onChange={onChange}
      />
    </Box>
  );
};
