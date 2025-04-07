'use client'

import React, { useState, useCallback, useMemo } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  HStack,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  VStack,
  Wrap,
  WrapItem,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Checkbox,
} from '@chakra-ui/react'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import { usePlatforms } from '@/hooks/usePlatforms'
import type { PlatformData } from '@/types'

interface PlatformSelectProps {
  selectedIds: string[]
  onChange: (ids: string[]) => void
  error?: string
}

export default function PlatformSelect({
  selectedIds,
  onChange,
  error,
}: PlatformSelectProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { platforms = [] } = usePlatforms()
  const [tempSelectedIds, setTempSelectedIds] = useState(selectedIds)
  const [searchTerm, setSearchTerm] = useState('')

  // Reset temp selection when modal opens
  React.useEffect(() => {
    setTempSelectedIds(selectedIds)
  }, [selectedIds, isOpen])

  const handlePlatformToggle = useCallback((platformId: string) => {
    setTempSelectedIds(current =>
      current.includes(platformId)
        ? current.filter(id => id !== platformId)
        : [...current, platformId]
    )
  }, [])

  const handleSave = () => {
    onChange(tempSelectedIds)
    onClose()
  }

  const handleClose = () => {
    setTempSelectedIds(selectedIds)
    onClose()
  }

  const removePlatform = (platformId: string) => {
    onChange(selectedIds.filter(id => id !== platformId))
  }

  const selectedPlatforms = useMemo(() => 
    (platforms || []).filter((platform: PlatformData) => selectedIds.includes(platform.id)),
    [platforms, selectedIds]
  )

  const filteredPlatforms = useMemo(() => {
    if (!searchTerm) return platforms || []
    const term = searchTerm.toLowerCase()
    return (platforms || []).filter((platform: PlatformData) =>
      platform.name.toLowerCase().includes(term) ||
      platform.manufacturer.toLowerCase().includes(term)
    )
  }, [platforms, searchTerm])

  return (
    <FormControl isInvalid={!!error}>
      <VStack align="stretch" spacing={3}>
        <Button
          size="sm"
          onClick={onOpen}
          colorScheme="blue"
          variant="outline"
          leftIcon={<AddIcon />}
        >
          Sélectionner des plateformes
        </Button>

        <Wrap spacing={2}>
          {selectedPlatforms.map((platform: PlatformData) => (
            <WrapItem key={platform.id}>
              <Tag
                size="md"
                borderRadius="full"
                variant="subtle"
                colorScheme="blue"
              >
                <TagLabel>{platform.name}</TagLabel>
                <TagCloseButton onClick={() => removePlatform(platform.id)} />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>

      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sélectionner des plateformes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Rechercher une plateforme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <List spacing={2}>
                {filteredPlatforms.map((platform: PlatformData) => (
                  <ListItem key={platform.id}>
                    <Checkbox
                      isChecked={tempSelectedIds.includes(platform.id)}
                      onChange={() => handlePlatformToggle(platform.id)}
                    >
                      <HStack>
                        <Text>{platform.name}</Text>
                        <Text color="gray.500" fontSize="sm">
                          ({platform.manufacturer})
                        </Text>
                      </HStack>
                    </Checkbox>
                  </ListItem>
                ))}
              </List>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Text color="gray.500">
                {tempSelectedIds.length} plateforme{tempSelectedIds.length > 1 ? 's' : ''} sélectionnée{tempSelectedIds.length > 1 ? 's' : ''}
              </Text>
              <Button variant="ghost" onClick={handleClose}>
                Annuler
              </Button>
              <Button colorScheme="blue" onClick={handleSave}>
                Confirmer la sélection
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}
