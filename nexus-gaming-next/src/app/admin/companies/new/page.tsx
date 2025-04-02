'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useCompanies } from '@/hooks/useCompanies'
import CompanyForm from '../_components/CompanyForm'

export default function NewCompanyPage() {
  const { createCompany, isCreating } = useCompanies()
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    await createCompany(data)
    router.push('/admin/companies')
  }

  return (
    <CompanyForm
      onSubmit={handleSubmit}
      isLoading={isCreating}
      mode="create"
    />
  )
}
