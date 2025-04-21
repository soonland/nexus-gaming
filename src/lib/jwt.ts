import type { Role } from '@prisma/client';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

import type { AuthUser, IJWTPayload } from '@/types/auth';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const TOKEN_COOKIE = 'auth_token';

export async function signToken(user: AuthUser): Promise<string> {
  const payload: IJWTPayload = {
    sub: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    isActive: user.isActive,
    lastPasswordChange: user.lastPasswordChange,
    avatarUrl: user.avatarUrl,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
    .sign(secret);

  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as IJWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getToken(): Promise<string | null> {
  try {
    const cookiesList = await cookies();
    return cookiesList.get(TOKEN_COOKIE)?.value || null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getToken();
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  // Only verify token validity in middleware
  // Full user verification happens in API routes
  return {
    id: payload.sub,
    email: payload.email,
    username: payload.username,
    role: payload.role as Role,
    isActive: payload.isActive,
    lastPasswordChange: payload.lastPasswordChange,
    avatarUrl: payload.avatarUrl,
  };
}
