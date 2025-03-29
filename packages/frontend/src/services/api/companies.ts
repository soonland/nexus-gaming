import { Company, CompanyFormData } from '../../types/company'
import { api } from './client'

export const getCompanies = async (): Promise<Company[]> => {
  const { data } = await api.get<Company[]>('/companies')
  return data
}

export const getDevelopers = async (): Promise<Company[]> => {
  const { data } = await api.get<Company[]>('/companies/developers')
  return data
}

export const getPublishers = async (): Promise<Company[]> => {
  const { data } = await api.get<Company[]>('/companies/publishers')
  return data
}

export const getCompany = async (id: string): Promise<Company> => {
  const { data } = await api.get<Company>(`/companies/${id}`)
  return data
}

export const createCompany = async (company: CompanyFormData): Promise<Company> => {
  const { data } = await api.post<Company>('/companies', company)
  return data
}

export const updateCompany = async (
  id: string,
  company: CompanyFormData
): Promise<Company> => {
  const { data } = await api.put<Company>(`/companies/${id}`, company)
  return data
}

export const deleteCompany = async (id: string): Promise<Company> => {
  const { data } = await api.delete<Company>(`/companies/${id}`)
  return data
}
