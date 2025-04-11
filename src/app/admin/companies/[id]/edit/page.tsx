'use client'

import React from 'react'
import { Container, useToast, Alert, AlertIcon, Card, CardHeader, CardBody, Heading } from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { useCompanies, useCompany } from '@/hooks/useCompanies'
import CompanyForm from '../../_components/CompanyForm'
import CompanyFormLoading from '@/components/loading/CompanyFormLoading'

export default function EditCompanyPage() {
  const params = useParams()
  const id = params.id as string
  const { company, isLoading } = useCompany(id)
  const { updateCompany, isUpdating } = useCompanies()
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (data: any) => {
    try {
      await updateCompany({ id, data })
      toast({
        title: 'Société modifiée',
        status: 'success',
        duration: 3000,
      })
      router.push('/admin/companies')
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la société',
        status: 'error',
        duration: 3000,
      })
    }
  }

  if (isLoading) {
    return (
      <Container maxW="container.md" py={8}>
        <CompanyFormLoading />
      </Container>
    )
  }

  if (!company) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error">
          <AlertIcon />
          Société non trouvée
        </Alert>
      </Container>
    )
  }

  const initialData = {
    name: company.name,
    isDeveloper: company.isDeveloper,
    isPublisher: company.isPublisher,
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card>
        <CardHeader>
          <Heading size="lg">Modifier la société</Heading>
        </CardHeader>
        <CardBody>
          <CompanyForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/admin/companies')}
            isLoading={isUpdating}
            mode="edit"
          />
        </CardBody>
      </Card>
    </Container>
  )
}
