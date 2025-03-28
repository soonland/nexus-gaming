import { api } from './client'

interface Article {
  id: string
  title: string
  content: string
  publishedAt: string
  user: {
    id: string
    username: string
  }
  games: {
    game: {
      id: string
      title: string
      coverImage?: string
    }
  }[]
}

export interface ArticleFormData {
  title: string
  content: string
  gameIds: string[]
}

export const getArticles = () => {
  return api.get<Article[]>('/articles')
}

export const getArticle = (id: string) => {
  return api.get<Article>(`/articles/${id}`)
}

export const createArticle = (data: ArticleFormData) => {
  return api.post<Article>('/articles', data)
}

export const updateArticle = (id: string, data: Partial<ArticleFormData>) => {
  return api.patch<Article>(`/articles/${id}`, data)
}

export const deleteArticle = (id: string) => {
  return api.delete(`/articles/${id}`)
}
