'use client'

import React from 'react'
import { Container, useToast, Card, CardHeader, CardBody, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useCompanies } from '@/hooks/useCompanies'
import CompanyForm from '../_components/CompanyForm'

export default function NewCompanyPage() {
  const { createCompany, isCreating } = useCompanies()
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (data: any) => {
    try {
      await createCompany(data)
      toast({
        title: 'Société créée',
        status: 'success',
        duration: 3000,
      })
      router.push('/admin/companies')
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la société',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card>
        <CardHeader>
          <Heading size="lg">Nouvelle société</Heading>
        </CardHeader>
        <CardBody>
          <CompanyForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/admin/companies')}
            isLoading={isCreating}
            mode="create"
          />
        </CardBody>
      </Card>
    </Container>
  )
}
