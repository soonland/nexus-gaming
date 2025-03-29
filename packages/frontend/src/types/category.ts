export interface Category {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryInput {
  name: string
}

export interface UpdateCategoryInput {
  name: string
}
