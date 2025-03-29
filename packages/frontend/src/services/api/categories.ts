import { Category, CreateCategoryInput, UpdateCategoryInput } from '../../types/category'
import { api } from './client'

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories')
  return response.data
}

export const createCategory = async (data: CreateCategoryInput): Promise<Category> => {
  const response = await api.post('/categories', data)
  return response.data
}

export const updateCategory = async (id: string, data: UpdateCategoryInput): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, data)
  return response.data
}

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`)
}
