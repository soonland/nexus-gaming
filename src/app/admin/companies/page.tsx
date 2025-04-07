'use client'

import React, { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from '@chakra-ui/react'
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
} from '@chakra-ui/icons'
import Link from 'next/link'
import { useCompanies } from '@/hooks/useCompanies'

export default function CompaniesPage() {
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const { companies, deleteCompany, isLoading } = useCompanies()

  const filteredCompanies = useMemo(() => {
    if (!companies) return []
    
    return companies.filter(company => {
      const searchString = searchTerm.toLowerCase()
      return company.name.toLowerCase().includes(searchString)
    })
  }, [companies, searchTerm])

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette société ?')) {
      try {
        await deleteCompany(id)
        toast({
          title: 'Société supprimée',
          status: 'success',
          duration: 3000,
        })
      } catch (error) {
        toast({
          title: 'Erreur',
          description: "Une erreur est survenue lors de la suppression",
          status: 'error',
          duration: 5000,
        })
      }
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Gestion des sociétés</Heading>
          <Button
            as={Link}
            href="/admin/companies/new"
            colorScheme="blue"
            leftIcon={<AddIcon />}
          >
            Ajouter une société
          </Button>
        </HStack>

        <Box>
          <InputGroup maxW="md" mb={4}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Rechercher une société..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nom</Th>
                <Th>Type</Th>
                <Th>Jeux</Th>
                <Th width="100px">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCompanies.map((company) => (
                <Tr key={company.id}>
                  <Td>{company.name}</Td>
                  <Td>
                    <HStack spacing={2}>
                      {company.isDeveloper && (
                        <Badge colorScheme="blue">Développeur</Badge>
                      )}
                      {company.isPublisher && (
                        <Badge colorScheme="green">Éditeur</Badge>
                      )}
                    </HStack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      {(company._count?.gamesAsDev ?? 0) > 0 && (
                        <Badge colorScheme="blue">
                          {company._count?.gamesAsDev} dév.
                        </Badge>
                      )}
                      {(company._count?.gamesAsPub ?? 0) > 0 && (
                        <Badge colorScheme="green">
                          {company._count?.gamesAsPub} pub.
                        </Badge>
                      )}
                    </HStack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        as={Link}
                        href={`/admin/companies/${company.id}/edit`}
                        icon={<EditIcon />}
                        aria-label="Modifier"
                        size="sm"
                        colorScheme="blue"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Supprimer"
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(company.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  )
}
