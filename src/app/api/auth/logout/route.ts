import { NextResponse } from 'next/server'

const TOKEN_COOKIE = 'auth_token'

export async function POST() {
  const response = NextResponse.json({ success: true })

  // Remove the auth cookie
  response.cookies.delete(TOKEN_COOKIE)

  return response
}
