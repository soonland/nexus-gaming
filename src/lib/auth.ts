import type { Role } from '@prisma/client';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { verifyToken } from './jwt';

export interface IAuthenticatedUser {
  id: string;
  role: Role;
  username: string;
}

export interface ISession {
  user: IAuthenticatedUser;
}

export async function authenticateToken(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return {
    user: {
      id: payload.sub,
      role: payload.role as Role,
      username: payload.username,
    },
  };
}

export async function getServerSession(): Promise<ISession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    return {
      user: {
        id: payload.sub,
        role: payload.role as Role,
        username: payload.username,
      },
    };
  } catch {
    return null;
  }
}
