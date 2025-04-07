import { NextRequest } from 'next/server'

export type RouteContext = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
