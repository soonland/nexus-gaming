'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCompanies, useCompany } from '@/hooks/useCompanies'
import CompanyForm from '../../_components/CompanyForm'

export default function EditCompanyPage() {
  const params = useParams()
  const id = params.id as string
  const { company, isLoading } = useCompany(id)
  const { updateCompany, isUpdating } = useCompanies()
  const router = useRouter()

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!company) {
    return <div>Société non trouvée</div>
  }

  const handleSubmit = async (data: any) => {
    await updateCompany({ id, data })
    router.push('/admin/companies')
  }

  const initialData = {
    name: company.name,
    isDeveloper: company.isDeveloper,
    isPublisher: company.isPublisher,
  }

  return (
    <CompanyForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isUpdating}
      mode="edit"
    />
  )
}
